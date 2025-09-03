import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedLayout from "src/components/ProtectedLayout";
import Dashboard from "src/pages/Dashboard";
import Groups from "src/pages/Groups";
import Expenses from "src/pages/Expenses";
import Login from "src/pages/Login";
import NewExpense from "src/pages/NewExpense";
import NewGroup from "src/pages/NewGroup";
import EditExpense from "src/pages/EditExpense";
import EditGroup from "src/pages/EditGroup";

export default function AppRouter() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/auth" element={<Login />} />
      <Route path="/" element={token ? <ProtectedLayout /> : <Navigate to="/auth" replace />}>
        <Route index element={<Dashboard />} />
        <Route path="groups" element={<Groups />} />
        <Route path="groups/new" element={<NewGroup />} />
        <Route path="groups/:id/edit" element={<EditGroup />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="expenses/new" element={<NewExpense />} />
        <Route path="expenses/:id/edit" element={<EditExpense />} />
        {/* add more protected routes here */}
      </Route>
    </Routes>
  );
}