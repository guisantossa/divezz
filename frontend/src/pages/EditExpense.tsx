import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExpenseById, useUpdateExpense, useGroups } from "src/api/hooks";

export default function EditExpense() {
  const { id } = useParams();
  const numericId = Number(id);
  const { data: expense, isLoading } = useExpenseById(numericId);
  const { data: groups = [] } = useGroups();
  const update = useUpdateExpense();
  const nav = useNavigate();

  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [groupId, setGroupId] = useState<number | "">("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    if (expense) {
      setDescription(expense.description ?? "");
      setValue(String(expense.total_value ?? ""));
      setGroupId(expense.group_id ?? "");
      setDate(expense.date ? new Date(expense.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
    }
  }, [expense]);

  if (isLoading) return <div className="p-6">Carregando...</div>;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      description,
      total_value: parseFloat(String(value).replace(",", ".")),
      group_id: Number(groupId),
      payer_id: expense.payer_id, // keep existing payer unless you add a select to change it
      date: new Date(date).toISOString(),
    };
    try {
      await update.mutateAsync({ id: numericId, payload });
      nav("/expenses", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Editar despesa</h2>
        <label className="block mb-3">
          <div className="text-sm mb-1">Descrição</div>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border rounded" required />
        </label>

        <label className="block mb-3">
          <div className="text-sm mb-1">Valor</div>
          <input value={value} onChange={(e) => setValue(e.target.value)} className="w-full p-3 border rounded" required />
        </label>

        <label className="block mb-3">
          <div className="text-sm mb-1">Grupo</div>
          <select value={groupId} onChange={(e) => setGroupId(e.target.value ? Number(e.target.value) : "")} className="w-full p-3 border rounded" required>
            <option value="">Selecionar grupo</option>
            {(groups || []).map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </label>

        <label className="block mb-6">
          <div className="text-sm mb-1">Data</div>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 border rounded" required />
        </label>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => nav(-1)} className="px-4 py-2 border rounded">Cancelar</button>
          <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl">{update.isLoading ? "Salvando..." : "Salvar"}</button>
        </div>
      </form>
    </div>
  );
}