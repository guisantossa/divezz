import React, { useState } from "react";
import apiClient from "src/api/client";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { data } = await apiClient.post("/auth/login", { email, password });
    localStorage.setItem("token", data.access_token);
    nav("/", { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Entrar</h2>
        <input className="w-full mb-3 p-3 border rounded" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full mb-6 p-3 border rounded" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" type="password" />
        <button className="w-full bg-primary text-white py-3 rounded-xl">Entrar</button>
      </form>
    </div>
  );
}