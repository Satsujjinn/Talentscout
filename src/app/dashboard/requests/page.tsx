import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MatchRequestCard from "./components/MatchRequestCard";

export default async function RequestsPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // Check if user is a recruiter by getting from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser || dbUser.role !== "recruiter") {
    redirect("/dashboard");
  }

  // Fetch sent match requests
  const matchRequests = await prisma.matchRequest.findMany({
    where: { recruiterId: user.id },
    include: {
      athlete: {
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
          Sent Requests
        </h1>
        <p className="text-gray-600 text-lg">
          Track your match requests and responses from athletes
        </p>
        <div className="mt-4 text-sm text-gray-500">
          {formattedRequests.length} request{formattedRequests.length !== 1 ? 's' : ''} sent
        </div>
      </div>

      {formattedRequests.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-500 text-xl mb-4">
            No requests sent yet.
          </div>
          <p className="text-gray-400">
            Start by browsing athletes and sending match requests!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formattedRequests.map((request) => (
            <MatchRequestCard 
              key={request.id} 
              request={request}
            />
          ))}
        </div>
      )}
    </div>
  );
} 