import Link from "next/link";

interface RecruiterDashboardProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddresses: string[];
  };
}

export default function RecruiterDashboard({ user }: RecruiterDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user.firstName || "Recruiter"}!
        </h1>
        <p className="text-gray-600">
          Discover and connect with talented athletes in the Western Cape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Athlete Discovery */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Discover Athletes
          </h3>
          <p className="text-gray-600 mb-4">
            Browse through talented athletes and find your next star player.
          </p>
          <Link 
            href="/dashboard/discover"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            Browse Athletes
          </Link>
        </div>

        {/* Sent Requests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sent Requests
          </h3>
          <p className="text-gray-600 mb-4">
            Track your match requests and responses from athletes.
          </p>
          <Link 
            href="/dashboard/requests"
            className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-center"
          >
            View Requests
          </Link>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Messages
          </h3>
          <p className="text-gray-600 mb-4">
            Chat with athletes who have accepted your requests.
          </p>
          <Link 
            href="/dashboard/messages"
            className="block w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors text-center"
          >
            Open Messages
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Athletes Viewed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Requests Sent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Active Chats</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            No recent activity. Start by browsing athletes!
          </div>
        </div>
      </div>
    </div>
  );
} 