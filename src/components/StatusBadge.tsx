import React from "react";
import type { CommonStatus } from "../utils/status";

interface StatusBadgeProps {
  status: CommonStatus;
}

const colorMap: Record<CommonStatus, string> = {
  draft: "bg-gray-200 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  signed: "bg-green-200 text-green-800",
  void: "bg-gray-300 text-gray-800",
  paid: "bg-green-200 text-green-800",
  unpaid: "bg-red-200 text-red-800",
  overdue: "bg-orange-200 text-orange-800",
  archived: "bg-gray-300 text-gray-800",
  closed: "bg-gray-400 text-gray-800",
  open: "bg-blue-100 text-blue-800",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
