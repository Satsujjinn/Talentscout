import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Cloudinary configuration
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { imageData, imageType } = body;

    if (!imageData || !imageType) {
      return NextResponse.json({ error: "Image data and type required" }, { status: 400 });
    }

    // Validate image type
    if (!imageType.startsWith('image/')) {
      return NextResponse.json({ error: "Invalid image type" }, { status: 400 });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      `data:${imageType};base64,${imageData}`,
      {
        folder: 'talent-scout-profiles',
        public_id: `profile-${user.id}`,
        overwrite: true,
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      }
    );

    // Update user's profile with the Cloudinary URL
    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: { imageUrl: uploadResponse.secure_url },
      create: {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: uploadResponse.secure_url,
      },
    });

    return NextResponse.json({ 
      success: true, 
      imageUrl: uploadResponse.secure_url,
      profile: updatedProfile 
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 