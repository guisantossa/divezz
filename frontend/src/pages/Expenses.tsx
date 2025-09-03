import React from "react";
import { useInfiniteExpenses, useDeleteExpense } from "src/api/hooks";
import ExpenseCard from "src/components/ExpenseCard";
import { useNavigate } from "react-router-dom";

export default function Expenses() {
  const navigate = useNavigate();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteExpenses(20);
  const deleteMutation = useDeleteExpense();

  if (isLoading) return <div className="p-6">Carregando despesas...</div>;

  const pages = data?.pages ?? [];
  const items = pages.flatMap(p => p.data);

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja remover essa despesa?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
      alert("Erro ao remover");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Despesas</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate("/expenses/new")} className="bg-primary text-white px-4 py-2 rounded-xl shadow">Adicionar despesa</button>
          <button onClick={() => window.location.reload()} className="px-4 py-2 border rounded">Atualizar</button>
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="bg-white border rounded-lg p-6 text-gray-600">Nenhuma despesa encontrada.</div>
        ) : (
          items.map((e: any) => {
            const groupName = e.group?.name ?? e.group_name ?? null;
            const groupEmoji = e.group?.emoji ?? e.group_emoji ?? null;
            const groupLabel = groupName ? `${groupEmoji ? groupEmoji + " " : ""}${groupName}` : null;

            return (
              <div key={e.id} className="flex items-center justify-between gap-4 bg-white border rounded-lg p-3">
                <div className="flex-1">
                  <ExpenseCard
                    title={e.description ?? e.title}
                    subtitle={`${groupLabel ? groupLabel + " · " : ""}${e.payer_name ?? e.payer?.name ?? ""}`}
                    value={typeof e.total_value !== "undefined" ? (e.total_value >= 0 ? `+ R$${Math.abs(e.total_value).toFixed(2)}` : `- R$${Math.abs(e.total_value).toFixed(2)}`) : e.display_value}
                    positive={(e.total_value ?? 0) >= 0}
                    icon="💸"
                  />
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button onClick={() => navigate(`/expenses/${e.id}/edit`)} className="px-3 py-1 border rounded text-sm">Editar</button>
                  <button onClick={() => handleDelete(e.id)} className="px-3 py-1 border rounded text-sm text-red-600">Remover</button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="mt-6 flex justify-center">
        {hasNextPage ? (
          <button onClick={() => fetchNextPage()} className="px-4 py-2 border rounded">
            {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
          </button>
        ) : (
          <div className="text-sm text-gray-500">Fim da lista</div>
        )}
      </div>
    </div>
  );
}