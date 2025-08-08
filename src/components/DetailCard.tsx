import React from "react";

interface DetailCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const DetailCard: React.FC<DetailCardProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
};

export default DetailCard;
