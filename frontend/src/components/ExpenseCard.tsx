import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  value: string;
  positive?: boolean;
  icon?: string;
};

export default function ExpenseCard({ title, subtitle, value, positive = true, icon = "💸" }: Props) {
  return (
    <div className="bg-white border rounded-lg p-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="font-medium">{title}</div>
          {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        </div>
      </div>
      <div className={`font-semibold ${positive ? "text-green-600" : "text-red-500"}`}>{value}</div>
    </div>
  );
}