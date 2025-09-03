import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { me as fetchMe, logout as apiLogout } from 'src/api';
import logo from 'src/assets/logo.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const token = localStorage.getItem('token');

  const { data: user, isLoading } = useQuery(['me'], () => fetchMe(), {
    enabled: !!token,
    retry: false,
  });

  const [search, setSearch] = useState('');
  const [newOpen, setNewOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const newRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (newRef.current && !newRef.current.contains(e.target as Node)) setNewOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const handleLogout = () => {
    apiLogout();
    qc.clear();
    navigate('/auth', { replace: true });
  };

  const onSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = (search || '').trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="w-full border-b bg-white py-3 px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="App Logo" className="h-9 w-auto" />
          <span className="hidden sm:inline text-lg font-semibold">Divez</span>
        </Link>

        <form onSubmit={onSearchSubmit} className="hidden sm:flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar grupos, pessoas, despesas..."
            className="px-3 py-2 border rounded-md w-64 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="px-3 py-2 bg-primary text-white rounded-md text-sm">Buscar</button>
        </form>
      </div>

      <div className="flex items-center gap-3">
        <div ref={newRef} className="relative">
          <button
            onClick={() => setNewOpen((s) => !s)}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-md text-sm"
            aria-expanded={newOpen}
          >
            ➕ Novo
          </button>

          {newOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
              <button
                onClick={() => { setNewOpen(false); navigate('/groups/new'); }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
              >
                📁 Novo Grupo
              </button>
              <button
                onClick={() => { setNewOpen(false); navigate('/expenses/new'); }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
              >
                💸 Nova Despesa
              </button>
            </div>
          )}
        </div>

        <div className="hidden sm:block text-sm text-gray-500">
          {/* quick links */}
          <Link to="/groups" className="mr-3 hover:text-gray-700">Grupos</Link>
          <Link to="/expenses" className="hover:text-gray-700">Despesas</Link>
        </div>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden"
            aria-expanded={menuOpen}
          >
            {user?.photo_url ? (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img src={user.photo_url} alt="Avatar" className="w-10 h-10 object-cover" />
            ) : (
              <span className="text-lg">{(user?.name || user?.email || 'U').slice(0,1).toUpperCase()}</span>
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
              {isLoading ? (
                <div className="p-3 text-sm text-gray-500">Carregando...</div>
              ) : user ? (
                <>
                  <div className="px-3 py-2 border-b">
                    <div className="text-sm font-medium">{user.name ?? user.email}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <button onClick={() => { setMenuOpen(false); navigate('/profile'); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Perfil</button>
                  <button onClick={() => { setMenuOpen(false); navigate('/settings'); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Configurações</button>
                  <div className="border-t" />
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="block px-3 py-2 hover:bg-gray-50 text-sm">Login</Link>
                  <Link to="/register" className="block px-3 py-2 hover:bg-gray-50 text-sm">Registrar</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;