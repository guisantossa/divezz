import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from 'src/components/Header';
import Sidebar from 'src/components/Sidebar';

const ProtectedLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;