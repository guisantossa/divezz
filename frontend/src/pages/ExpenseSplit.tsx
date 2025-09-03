import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExpenseById, useGroupById, useSetExpenseSplits } from "src/api/hooks";

export default function ExpenseSplit() {
  const { id } = useParams<{ id: string }>();
  const expenseId = id ? Number(id) : undefined;
  const nav = useNavigate();

  const { data: expense, isLoading: loadingExpense } = useExpenseById(expenseId);
  const groupId = expense?.group_id;
  const { data: group, isLoading: loadingGroup } = useGroupById(groupId ?? undefined);
  const setSplits = useSetExpenseSplits();

  const members = group?.memberships ?? group?.members ?? [];
  const total = Number(expense?.total_value ?? expense?.total ?? 0);

  const [rows, setRows] = useState<{ user_id: number; name: string; amount: number; percentage: number }[]>([]);

  useEffect(() => {
    if (!members || members.length === 0) return;
    const validMembers = members.filter((m: any) => (m.user || m.user_id));
    const initial = validMembers.map((m: any) => {
      const u = m.user ?? { id: m.user_id, name: m.name ?? m.email ?? `User ${m.user_id}` };
      const amount = +(total / validMembers.length).toFixed(2);
      const perc = total ? +( (amount / total) * 100 ).toFixed(2) : 0;
      return { user_id: u.id, name: u.name ?? u.email, amount, percentage: perc };
    });
    setRows(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, total]);

  const updateAmount = (idx: number, amount: number) => {
    const newRows = [...rows];
    newRows[idx].amount = amount;
    newRows[idx].percentage = total ? +( (amount / total) * 100 ).toFixed(2) : 0;
    setRows(newRows);
  };

  const updatePercentage = (idx: number, percentage: number) => {
    const newRows = [...rows];
    newRows[idx].percentage = percentage;
    newRows[idx].amount = +( (percentage / 100) * total ).toFixed(2);
    setRows(newRows);
  };

  const equalSplit = () => {
    if (!rows.length) return;
    const n = rows.length;
    const base = Math.floor((total * 100) / n) / 100;
    const remainder = +(total - base * n).toFixed(2);
    const newRows = rows.map((r, i) => ({ ...r, amount: base + (i === 0 ? remainder : 0), percentage: +( ((base + (i === 0 ? remainder : 0)) / total) * 100 ).toFixed(2) }));
    setRows(newRows);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const sum = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
    if (Math.abs(sum - total) > 0.05) {
      return alert("Soma dos valores difere do total. Ajuste para prosseguir.");
    }
    try {
      await setSplits.mutateAsync({ expenseId: expenseId!, splits: rows.map(r => ({ user_id: r.user_id, amount: r.amount, percentage: r.percentage })) });
      nav(`/expenses/${expenseId}`);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Erro ao salvar divisão");
    }
  };

  if (loadingExpense || loadingGroup) return <div className="p-6">Carregando...</div>;
  if (!expense) return <div className="p-6">Despesa não encontrada.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Dividir despesa: {expense.description ?? expense.title}</h2>
        <div className="mb-4 text-sm text-gray-600">Total: R${total.toFixed(2)}</div>

        <div className="flex gap-2 mb-4">
          <button onClick={equalSplit} className="px-3 py-2 bg-primary text-white rounded">Dividir igualmente</button>
          <button onClick={() => {
            const n = rows.length;
            if (!n) return;
            const perc = +(100 / n).toFixed(2);
            setRows(rows.map(r => ({ ...r, percentage: perc, amount: +( (perc/100) * total ).toFixed(2) })));
          }} className="px-3 py-2 border rounded">Porcentagem igual</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            {rows.map((r, idx) => (
              <div key={r.user_id} className="flex items-center gap-3">
                <div className="w-40 text-sm">{r.name}</div>
                <input className="p-2 border rounded w-32" value={r.amount} type="number" step="0.01" onChange={(e) => updateAmount(idx, Number(e.target.value || 0))} />
                <input className="p-2 border rounded w-24" value={r.percentage} type="number" step="0.01" onChange={(e) => updatePercentage(idx, Number(e.target.value || 0))} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={() => nav(-1)} className="px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded">{setSplits.isLoading ? "Salvando..." : "Salvar divisão"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}