import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MatchRequestCard from "./components/MatchRequestCard";
import Link from "next/link";

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
        <h1 className="text-4xl font-bold text-warm-brown-900 mb-3">
          Sent Requests
        </h1>
        <p className="text-warm-brown-700 text-lg">
          Track your match requests and responses from athletes
        </p>
        <div className="mt-4 text-sm text-warm-brown-500">
          {formattedRequests.length} request{formattedRequests.length !== 1 ? 's' : ''} sent
        </div>
      </div>

      {formattedRequests.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-warm-brown-500 text-xl mb-4">
            No requests sent yet
          </div>
          <p className="text-warm-brown-400 mb-6">
            Start by browsing athletes in the Discover section and sending match requests to talented players you'd like to connect with.
          </p>
          <Link 
            href="/dashboard/discover"
            className="bg-accent-gold-600 text-white px-6 py-2 rounded-lg hover:bg-accent-gold-700 transition-colors"
          >
            Browse Athletes
          </Link>
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