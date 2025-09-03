import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Início", icon: "🏠" },
  { to: "/groups", label: "Grupos", icon: "👥" },
  { to: "/expenses", label: "Despesas", icon: "📋" },
  { to: "/reports", label: "Relatórios", icon: "📊" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r min-h-screen p-6 hidden md:block">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">S</div>
        <div className="text-lg font-semibold">SPLIT DE DESPESAS</div>
      </div>

      <nav className="flex flex-col gap-2">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive ? "bg-gray-100 font-semibold" : "text-gray-700 hover:bg-gray-50"}`
            }
          >
            <span className="text-xl">{it.icon}</span>
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}