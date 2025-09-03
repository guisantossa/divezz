import React, { useState, useEffect } from "react";
import { useGroups } from "src/api/hooks";
import { useCreateExpense } from "src/api/hooks";
import { useNavigate } from "react-router-dom";

export default function ExpenseForm() {
  const { data: groups = [], isLoading: groupsLoading } = useGroups();
  const createExpense = useCreateExpense();
  const nav = useNavigate();

  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [groupId, setGroupId] = useState<number | "">("");
  const [payerId, setPayerId] = useState<number | "">("");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10)); // YYYY-MM-DD

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Backend expects: group_id:int, payer_id:int, description:str, total_value:float, date:datetime
    // Require group and payer per backend schema (adjust backend if you want them optional)
    if (!groupId || !payerId) {
      alert("Selecione grupo e pagador (obrigatório conforme backend).");
      return;
    }

    const total_value = parseFloat(String(value).replace(",", ".") || "0");

    const payload = {
      group_id: Number(groupId),
      payer_id: Number(payerId),
      description: description,
      total_value: total_value,
      date: new Date(date).toISOString(),
    };

    try {
      const created = await createExpense.mutateAsync(payload);
      // expect created.id to exist
      const eid = created?.id ?? created?.expense_id;
      if (eid) {
        nav(`/expenses/${eid}/split`);
      } else {
        nav("/", { replace: true });
      }
    } catch (err) {
      console.error("create expense error", err);
      alert("Erro ao salvar despesa");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Nova despesa</h2>

      <label className="block mb-3">
        <div className="text-sm mb-1">Descrição</div>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border rounded" required />
      </label>

      <label className="block mb-3">
        <div className="text-sm mb-1">Valor</div>
        <input value={value} onChange={(e) => setValue(e.target.value)} className="w-full p-3 border rounded" placeholder="0.00" required />
      </label>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <label>
          <div className="text-sm mb-1">Grupo</div>
          <select value={groupId} onChange={(e) => setGroupId(e.target.value ? Number(e.target.value) : "")} className="w-full p-3 border rounded" required>
            <option value="">Selecionar grupo</option>
            {groupsLoading ? <option>Carregando...</option> : (groups || []).map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </label>

        <label>
          <div className="text-sm mb-1">Pago por</div>
          <select value={payerId} onChange={(e) => setPayerId(e.target.value ? Number(e.target.value) : "")} className="w-full p-3 border rounded" required>
            <option value="">Selecionar pagador</option>
            {/* TODO: replace with actual group members once available */}
            <option value="1">Você (default)</option>
          </select>
        </label>
      </div>

      <label className="block mb-6">
        <div className="text-sm mb-1">Data</div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 border rounded" required />
      </label>

      <div className="flex gap-3 justify-end">
        <button type="button" className="px-4 py-2 border rounded" onClick={() => nav(-1)}>Cancelar</button>
        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl">{createExpense.isLoading ? "Salvando..." : "Salvar"}</button>
      </div>
    </form>
  );
}