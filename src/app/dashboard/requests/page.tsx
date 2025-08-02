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
          <div className="w-24 h-24 mx-auto mb-6 bg-cream-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-warm-brown-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-warm-brown-900 mb-2">
            No Requests Sent Yet
          </h3>
          <p className="text-warm-brown-600 max-w-md mx-auto">
            Start by browsing athletes in the Discover section and sending match requests to talented players.
          </p>
          <Link 
            href="/dashboard/discover"
            className="mt-6 inline-block px-6 py-2 bg-accent-gold-600 text-white rounded-lg hover:bg-accent-gold-700 transition-colors"
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