import React, { useState, useEffect } from "react";
import { useGroups, useDeleteGroup, useGroupById, useInviteMember } from "src/api/hooks";
import GroupCard from "src/components/GroupCard";
import { useNavigate } from "react-router-dom";

export default function Groups() {
  const { data: groups, isLoading } = useGroups();
  const navigate = useNavigate();
  const deleteMutation = useDeleteGroup();
  const inviteMutation = useInviteMember();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // invite form state
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [inviting, setInviting] = useState<boolean>(false);

  // hook to fetch the selected group's full info (members, owner, etc.)
  const { data: selectedGroup, isLoading: selectedLoading, refetch: refetchSelected } = useGroupById(
    selectedGroupId ?? undefined
  );

  // quando mudar o grupo selecionado, force refetch — dep apenas em selectedGroupId para evitar loop
  useEffect(() => {
    if (!selectedGroupId) return;

    // não colocar refetchSelected nos deps; chamamos de forma segura aqui
    (async () => {
      try {
        await refetchSelected();
      } catch {
        // swallow errors — a UI já mostra estado de loading / erro
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupId]);

  const inviteMember = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedGroupId) return alert("Selecione um grupo");
    const email = (inviteEmail || "").trim();
    if (!email) return alert("Informe um email válido");

    setInviting(true);
    try {
      await inviteMutation.mutateAsync({ groupId: selectedGroupId, email });
      alert("Convite enviado (status pendente).");
      setInviteEmail("");
      // refetch selected group if possible
      if (typeof refetchSelected === "function") await refetchSelected();
    } catch (err: any) {
      console.error(err);
      alert("Erro ao enviar convite: " + (err.message || err));
    } finally {
      setInviting(false);
    }
  };

  if (isLoading) return <div className="p-6">Carregando...</div>;

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja remover este grupo?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
      alert("Erro ao remover o grupo");
    }
  };

  const openMembers = (id: number) => {
    // atualiza o estado — o useEffect observa selectedGroupId e fará o refetch corretamente.
    // NÃO chamar refetchSelected() aqui porque setState é assíncrono e causou fetch com "undefined".
    setSelectedGroupId(id);
  };

  const closeMembers = () => setSelectedGroupId(null);

  const renderMembers = () => {
    if (!selectedGroupId) return null;

    if (selectedLoading) {
      return (
        <aside className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl p-6 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Membros</h3>
            <button onClick={closeMembers} className="text-sm px-2 py-1">Fechar</button>
          </div>
          <div>Carregando...</div>
        </aside>
      );
    }

    // Normaliza possíveis formatos retornados pela API
    // Prioridade: memberships (objeto com status), members, users, group.members
    const raw = selectedGroup ?? {};
    const possible =
      raw.memberships ??
      raw.members ??
      raw.users ??
      raw.members_list ??
      (raw.group && (raw.group.memberships || raw.group.members || raw.group.users)) ??
      [];

    // garantir array
    const memberships: any[] = Array.isArray(possible) ? possible : [];

    const ownerId = raw.owner_id ?? raw.group?.owner_id ?? null;

    return (
      <>
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeMembers}
          aria-hidden
        />
        <aside className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl p-6 z-50 overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{raw.emoji ?? "👜"}</div>
                <div>
                  <h3 className="text-lg font-semibold">{raw.name ?? raw.group?.name}</h3>
                  <div className="text-sm text-gray-500">Grupo #{raw.id ?? raw.group?.id}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={closeMembers} className="px-3 py-1 border rounded text-sm">
                Fechar
              </button>
              <button
                onClick={() => navigate(`/groups/${selectedGroupId}/edit`)}
                className="px-3 py-1 bg-primary text-white rounded text-sm"
              >
                Editar
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Integrantes</h4>

            {memberships.length === 0 ? (
              <div className="text-sm text-gray-500">
                Nenhum membro encontrado.
              </div>
            ) : (
              <ul className="space-y-3">
                {memberships.map((m: any, idx: number) => {
                  const membership = m.user || m.user_id || m.invited_email || m.status ? m : { user: m, status: "accepted" };
                  const user = membership.user ?? null;
                  const invitedEmail = membership.invited_email ?? null;
                  const status = (membership.status ?? "accepted").toLowerCase();
                  const role = membership.role ?? null;

                  const displayName = user
                    ? user.name ?? user.full_name ?? user.email
                    : invitedEmail ?? `Convidado ${idx + 1}`;

                  const email = user?.email ?? invitedEmail ?? null;
                  const isOwner = ownerId === (user?.id ?? membership.user_id ?? null);

                  const initials = (displayName || "")
                    .split(" ")
                    .map((s: string) => s[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <li key={user?.id ?? invitedEmail ?? idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-medium overflow-hidden">
                          {user?.photo_url ? (
                            // eslint-disable-next-line jsx-a11y/img-redundant-alt
                            <img src={user.photo_url} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <span>{initials || "U"}</span>
                          )}
                        </div>

                        <div>
                          <div className="font-medium">{displayName}</div>
                          {email && <div className="text-xs text-gray-500">{email}</div>}
                          {role && <div className="text-xs text-gray-500">Função: {role}</div>}
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        {isOwner && <div className="text-xs text-green-600 font-medium">Proprietário</div>}

                        {status === "pending" ? (
                          <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">Pendente</span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Ativo</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Ações</h4>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`${window.location.origin}/groups/${selectedGroupId}`);
                    alert("Link copiado");
                  }}
                  className="px-3 py-2 border rounded"
                >
                  Copiar link
                </button>
              </div>

              <form onSubmit={inviteMember} className="flex gap-2 items-center">
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={inviteEmail}
                  onChange={(ev) => setInviteEmail(ev.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                  disabled={inviting}
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded disabled:opacity-60"
                  disabled={inviting}
                >
                  {inviting ? "Enviando..." : "Convidar"}
                </button>
              </form>
            </div>
          </div>
        </aside>
      </>
    );
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Grupos</h1>
          <div className="text-sm text-gray-500 mt-1">Veja e gerencie seus grupos</div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate("/groups/new")}
            className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-xl shadow"
          >
            Adicionar grupo
          </button>
        </div>
      </div>

      {/* grid com linhas de altura igual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {(groups || []).length === 0 ? (
          <div className="col-span-full bg-white border rounded-lg p-8 text-gray-600 text-center">
            Nenhum grupo ainda. Crie o primeiro grupo.
          </div>
        ) : (
          (groups || []).map((g: any) => (
            // adicionei "group" para fazer o hover funcionar, e h-full/min-h para preencher
            <div key={g.id} className="relative group flex flex-col h-full min-h-[180px]">
              {/* força o card preencher a célula */}
              <div className="flex-1">
                <GroupCard
                  title={g.name}
                  balance={g.balance}
                  emoji={g.emoji ?? "👜"}
                />
              </div>

              {/* Desktop actions: aparecem ao hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex flex-col gap-2">
                <button
                  onClick={() => openMembers(g.id)}
                  className="px-2 py-1 border rounded text-sm bg-white"
                >
                  Ver membros
                </button>
                <button
                  onClick={() => navigate(`/groups/${g.id}/edit`)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(g.id)}
                  className="px-2 py-1 border rounded text-sm text-red-600"
                >
                  Remover
                </button>
              </div>

              {/* Mobile actions: sempre visíveis abaixo do card */}
              <div className="mt-3 flex md:hidden items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => openMembers(g.id)}
                    className="px-3 py-2 border rounded text-sm bg-white"
                  >
                    Membros
                  </button>
                  <button
                    onClick={() => navigate(`/groups/${g.id}/edit`)}
                    className="px-3 py-2 border rounded text-sm"
                  >
                    Editar
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(g.id)}
                  className="px-3 py-2 border rounded text-sm text-red-600"
                >
                  Remover
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {renderMembers()}
    </div>
  );
}
