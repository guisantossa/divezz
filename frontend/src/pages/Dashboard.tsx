import React from "react";
import GroupCard from "src/components/GroupCard";
import ExpenseCard from "src/components/ExpenseCard";
import { useGroups, useRecentExpenses } from "src/api/hooks";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: groups, isLoading: groupsLoading } = useGroups();
  const { data: recent, isLoading: recentLoading } = useRecentExpenses();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Início</h1>

      <div className="mb-8">
        <button onClick={() => navigate("/expenses/new")} className="bg-primary hover:bg-green-500 text-white px-6 py-3 rounded-xl font-semibold shadow">Adicionar despesa</button>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Grupos</h2>
        <div className="flex gap-4">
          {groupsLoading ? (
            <div>Carregando grupos...</div>
          ) : (groups || []).map((g: any) => (
            <GroupCard key={g.id} title={g.name} balance={g.balance} emoji={g.emoji ?? "👜"} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Despesas recentes</h3>
          <div className="space-y-3">
            {recentLoading ? (
              <div>Carregando despesas...</div>
            ) : (recent || []).map((r: any) => (
              <ExpenseCard key={r.id} title={r.description} subtitle={r.payer_name} value={typeof r.total_value !== "undefined" ? (r.total_value >= 0 ? `+ R$${Math.abs(r.total_value).toFixed(2)}` : `- R$${Math.abs(r.total_value).toFixed(2)}`) : r.display_value} positive={(r.total_value ?? 0) >= 0} icon="💸" />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Total entre amigos</h3>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            {/* replace with real aggregated data */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium">Ana</div>
                <div className="text-sm text-gray-500">Você deve</div>
              </div>
              <div className="text-red-500 font-semibold">-R$100,00</div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Paulo</div>
                <div className="text-sm text-gray-500">Te devem</div>
              </div>
              <div className="text-green-600 font-semibold">+R$60,00</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
