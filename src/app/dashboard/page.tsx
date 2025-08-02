import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AthleteDashboard from "./components/AthleteDashboard";
import RecruiterDashboard from "./components/RecruiterDashboard";
import RoleSelection from "./components/RoleSelection";

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // Get user role from our database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  // Create a plain object with only the necessary user data
  // Extract email addresses as plain strings to avoid serialization issues
  const userData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddresses: user.emailAddresses?.map(email => email.emailAddress) || [],
  };

  if (!dbUser || !dbUser.role) {
    // If no role is set, show role selection
    return <RoleSelection user={userData} />;
  }

  return (
    <div>
      {dbUser.role === "athlete" ? (
        <AthleteDashboard user={userData} />
      ) : (
        <RecruiterDashboard user={userData} />
      )}
    </div>
  );
} 