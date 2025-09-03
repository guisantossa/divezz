import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthGuard } from "src/components/AuthGuard";
import ProtectedLayout from "src/components/ProtectedLayout";

import Auth from "src/pages/Auth";
import Register from "src/pages/Register";
import Dashboard from "src/pages/Dashboard";
import Groups from "src/pages/Groups";
import GroupDetail from "src/pages/GroupDetail";
import Expenses from "src/pages/Expenses";
import NewExpense from "src/pages/NewExpense";
import ExpenseSplit from "src/pages/ExpenseSplit";
import EditExpense from "src/pages/EditExpense"; // criado abaixo se necessário
import NewGroup from "src/pages/NewGroup";
import EditGroup from "src/pages/EditGroup";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />

        {/* Protected area (uses ProtectedLayout which must render <Outlet />) */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <ProtectedLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/new" element={<NewGroup />} />
          <Route path="groups/:id" element={<GroupDetail />} />
          <Route path="groups/:id/edit" element={<EditGroup />} />

          {/* expenses list / new / detail / edit / split */}
          <Route path="expenses" element={<Expenses />} />
          <Route path="expenses/new" element={<NewExpense />} />
          <Route path="expenses/:id/edit" element={<EditExpense />} />
          <Route path="expenses/:id" element={<div>Expense detail</div>} />
          <Route path="expenses/:id/split" element={<ExpenseSplit />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;