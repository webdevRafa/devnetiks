import React from "react";
import DetailCard from "@/components/DetailCard";

const DashboardHome: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DetailCard title="Pipeline">Soon: proposals, projects status.</DetailCard>
      <DetailCard title="Invoices Due">Soon: unpaid/overdue.</DetailCard>
      <DetailCard title="Support">Soon: open tickets.</DetailCard>
    </div>
  );
};

export default DashboardHome;
