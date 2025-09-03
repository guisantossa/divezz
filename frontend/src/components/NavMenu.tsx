import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/", label: "Início", icon: ( /* home */ ) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 21V11h14v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )
  },
  { to: "/groups", label: "Grupos", icon: ( /* groups */ ) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )
  },
  { to: "/expenses/new", label: "Adicionar", icon: ( /* plus */ ) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )
  },
  { to: "/profile", label: "Perfil", icon: ( /* profile */ ) => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M6 20c1.5-3 4.5-4 6-4s4.5 1 6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )
  },
];

export default function NavMenu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    // optionally clear other client state
    navigate("/auth", { replace: true });
  };

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
      isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block w-64 bg-white border-r h-full p-3">
        <div className="mb-4 font-bold text-lg">Split de Despesas</div>
        <nav className="flex flex-col gap-2">
          {navItems.map((it) => (
            <NavLink key={it.to} to={it.to} className={({ isActive }) => linkClass(isActive)}>
              <span className="text-gray-500">{it.icon()}</span>
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 border-t pt-3">
          <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50">
            Sair
          </button>
        </div>
      </aside>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2">
        {navItems.map((it) => (
          <NavLink key={it.to} to={it.to} className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? "text-blue-600" : "text-gray-600"}`}>
            <div className="mb-1">{it.icon()}</div>
            <div>{it.label}</div>
          </NavLink>
        ))}
        <button onClick={handleLogout} className="text-red-600 text-xs">
          Sair
        </button>
      </nav>
    </>
  );
}