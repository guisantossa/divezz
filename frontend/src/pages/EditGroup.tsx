import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroupById, useUpdateGroup } from "src/api/hooks";

export default function EditGroup() {
  const { id } = useParams();
  const numericId = Number(id);
  const { data: group, isLoading } = useGroupById(numericId);
  const update = useUpdateGroup();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("👜");

  useEffect(() => {
    if (group) {
      setName(group.name ?? "");
      setEmoji(group.emoji ?? "👜");
    }
  }, [group]);

  if (isLoading) return <div className="p-6">Carregando...</div>;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await update.mutateAsync({ id: numericId, payload: { name, emoji } });
      nav("/groups", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Editar grupo</h2>
        <label className="block mb-3">
          <div className="text-sm mb-1">Nome do grupo</div>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded" required />
        </label>

        <label className="block mb-6">
          <div className="text-sm mb-1">Emoji (opcional)</div>
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} className="w-full p-3 border rounded" />
        </label>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => nav(-1)} className="px-4 py-2 border rounded">Cancelar</button>
          <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl">Salvar</button>
        </div>
      </form>
    </div>
  );
}