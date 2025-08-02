import Link from "next/link";

interface AthleteDashboardProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddresses: string[];
  };
}

export default function AthleteDashboard({ user }: AthleteDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user.firstName || "Athlete"}!
        </h1>
        <p className="text-gray-600">
          Showcase your talent and connect with recruiters in the Western Cape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Profile
          </h3>
          <p className="text-gray-600 mb-4">
            Create and manage your athlete profile to attract recruiters.
          </p>
          <Link 
            href="/dashboard/profile"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            Manage Profile
          </Link>
        </div>

        {/* Match Requests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Match Requests
          </h3>
          <p className="text-gray-600 mb-4">
            Review and respond to requests from recruiters.
          </p>
          <Link 
            href="/dashboard/requests/received"
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
            Chat with recruiters who have matched with you.
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
            <div className="text-sm text-gray-600">Profile Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Match Requests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Active Chats</div>
          </div>
        </div>
      </div>
    </div>
  );
} 