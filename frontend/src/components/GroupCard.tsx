import React from "react";

type Props = {
  title: string;
  balance?: string;
  emoji?: string;
};

export default function GroupCard({ title, balance, emoji = "👜" }: Props) {
  return (
    <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-3 w-64 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-2xl">{emoji}</div>
        <div className="font-medium">{title}</div>
      </div>
      {balance && <div className="text-green-600 font-semibold">{balance}</div>}
    </div>
  );
}