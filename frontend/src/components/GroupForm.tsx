import React, { useState } from "react";
import { useCreateGroup } from "src/api/hooks";
import { useNavigate } from "react-router-dom";

export default function GroupForm() {
  const createGroup = useCreateGroup();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("👜");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGroup.mutateAsync({ name, emoji });
      nav("/groups", { replace: true });
    } catch (err) {
      console.error("create group error", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-md">
      <h2 className="text-xl font-semibold mb-4">Novo grupo</h2>

      <label className="block mb-3">
        <div className="text-sm mb-1">Nome do grupo</div>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded" placeholder="Ex: Viagem" required />
      </label>

      <label className="block mb-6">
        <div className="text-sm mb-1">Emoji (opcional)</div>
        <input value={emoji} onChange={(e) => setEmoji(e.target.value)} className="w-full p-3 border rounded" />
      </label>

      <div className="flex gap-3 justify-end">
        <button type="button" className="px-4 py-2 border rounded" onClick={() => nav(-1)}>Cancelar</button>
        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl">{createGroup.isLoading ? "Salvando..." : "Criar"}</button>
      </div>
    </form>
  );
}