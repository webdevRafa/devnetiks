import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ClientHomePage: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold mb-2">Start here</h2>
        <p className="text-sm text-gray-600 mb-4">
          This is your client dashboard. From here you can view your
          organization and related work.
        </p>
        <Link
          to="/client/organization"
          className="inline-block rounded-xl bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
        >
          View my organization
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold mb-2">Account</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            <span className="text-gray-500">Email:</span>{" "}
            {profile?.email || "-"}
          </div>
          <div>
            <span className="text-gray-500">User ID:</span> {profile?.id || "-"}
          </div>
          <div>
            <span className="text-gray-500">Role:</span> {profile?.role || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHomePage;
