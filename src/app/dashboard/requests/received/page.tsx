import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReceivedRequestCard from "./components/ReceivedRequestCard";

export default async function ReceivedRequestsPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // Check if user is an athlete by getting from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser || dbUser.role !== "athlete") {
    redirect("/dashboard");
  }

  // Fetch received match requests
  const matchRequests = await prisma.matchRequest.findMany({
    where: { athleteId: user.id },
    include: {
      recruiter: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Convert Date objects to strings for the component
  const formattedRequests = matchRequests.map(request => ({
    ...request,
    createdAt: request.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Received Requests
        </h1>
        <p className="text-gray-600 text-lg">
          Review and respond to match requests from recruiters
        </p>
        <div className="mt-4 text-sm text-gray-500">
          {formattedRequests.length} request{formattedRequests.length !== 1 ? 's' : ''} received
        </div>
      </div>

      {formattedRequests.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-500 text-xl mb-4">
            No requests received yet.
          </div>
          <p className="text-gray-400">
            Recruiters will send you match requests when they&apos;re interested in your profile.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formattedRequests.map((request) => (
            <ReceivedRequestCard 
              key={request.id} 
              request={request}
              currentUserId={user.id}
            />
          ))}
        </div>
      )}
    </div>
  );
} 