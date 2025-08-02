const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('🌱 Starting clean database setup...');

    // Create a single admin user for testing (optional)
    const adminUser = {
      id: 'admin_test_user',
      role: 'recruiter',
      profile: {
        name: 'Admin User',
        bio: 'System administrator for Talent Scout ZA platform.',
        sport: 'Multi-sport',
        achievements: 'Platform administrator',
        stats: 'System management',
        imageUrl: null
      }
    };

    console.log('📝 Setting up clean database structure...');
    
    // Create admin user (optional - can be removed for production)
    await prisma.user.upsert({
      where: { id: adminUser.id },
      update: {},
      create: {
        id: adminUser.id,
        role: adminUser.role,
      }
    });

    await prisma.profile.upsert({
      where: { userId: adminUser.id },
      update: adminUser.profile,
      create: {
        ...adminUser.profile,
        userId: adminUser.id,
      }
    });

    console.log('✅ Clean database setup completed');
    console.log('🎉 Platform ready for real user interactions!');
    console.log('📋 Users can now:');
    console.log('   • Sign up and create real profiles');
    console.log('   • Choose their role (athlete/recruiter)');
    console.log('   • Browse and discover real users');
    console.log('   • Send and receive match requests');
    console.log('   • Communicate through real-time messaging');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedData()
  .then(() => {
    console.log('✅ Clean setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }); 