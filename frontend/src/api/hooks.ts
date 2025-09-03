import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";

import apiClient from "./client";

export function useGroups() {
  return useQuery(["groups"], async () => {
    const { data } = await apiClient.get("/groups");
    return data;
  }, { staleTime: 1000 * 60 });
}

export function useRecentExpenses() {
  return useQuery(["expenses", "recent"], async () => {
    const { data } = await apiClient.get("/expenses?limit=5");
    return data;
  }, { staleTime: 1000 * 30 });
}

// new: list all expenses (paginated if backend supports query)
export function useExpenses(params: { skip?: number; limit?: number } = {}) {
  const { skip = 0, limit = 100 } = params;
  return useQuery(["expenses", skip, limit], async () => {
    const { data } = await apiClient.get(`/expenses?skip=${skip}&limit=${limit}`);
    return data;
  }, { staleTime: 1000 * 30 });
}

// new: infinite expenses
export function useInfiniteExpenses(limit = 20) {
  return useInfiniteQuery(
    ["expenses", "infinite"],
    async ({ pageParam = 0 }) => {
      const { data } = await apiClient.get(`/expenses?skip=${pageParam}&limit=${limit}`);
      return { data, next: data.length === limit ? pageParam + limit : null };
    },
    {
      getNextPageParam: (last) => last.next,
      staleTime: 1000 * 30,
    }
  );
}

// get single expense
export function useExpenseById(expenseId?: number | null) {
  return useQuery(
    ["expense", expenseId ?? "none"],
    async () => {
      if (!expenseId) throw new Error("no-id");
      const { data } = await apiClient.get(`/expenses/${expenseId}`);
      return data;
    },
    {
      enabled: !!expenseId,
      keepPreviousData: true,
    }
  );
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation(
    async (payload: any) => {
      const { data } = await apiClient.post("/expenses", payload);
      return data;
    },
    {
      onSuccess: () => {
        qc.invalidateQueries(["expenses"]);
        qc.invalidateQueries(["expenses", "infinite"]);
        qc.invalidateQueries(["groups"]);
      },
    }
  );
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation(
    async ({ id, payload }: { id: number; payload: any }) => {
      const { data } = await apiClient.put(`/expenses/${id}`, payload);
      return data;
    },
    {
      onSuccess: () => {
        qc.invalidateQueries(["expenses"]);
        qc.invalidateQueries(["expense"]);
        qc.invalidateQueries(["expenses", "infinite"]);
      },
    }
  );
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation(
    async (id: number) => {
      const { data } = await apiClient.delete(`/expenses/${id}`);
      return data;
    },
    {
      onSuccess: () => {
        qc.invalidateQueries(["expenses"]);
        qc.invalidateQueries(["expenses", "infinite"]);
      },
    }
  );
}

// Groups helpers
export function useGroupById(groupId?: number | null) {
  const queryKey = ["group", groupId ?? "none"];

  const query = useQuery(
    queryKey,
    async () => {
      if (groupId == null) throw new Error("no-id");
      const { data } = await apiClient.get(`/groups/${groupId}`);
      return data;
    },
    {
      // only run when we have a valid id
      enabled: !!groupId,
      // keep previous data while refetching (optional)
      keepPreviousData: true,
      retry: 1,
    }
  );

  // provide a safe refetch that won't call the API when id is missing
  const safeRefetch = async () => {
    if (!groupId) return null;
    return query.refetch();
  };

  return {
    ...query,
    refetch: safeRefetch,
  };
}

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation(
    async (payload: any) => {
      const { data } = await apiClient.post("/groups", payload);
      return data;
    },
    {
      onSuccess: () => qc.invalidateQueries(["groups"]),
    }
  );
}

export function useUpdateGroup() {
  const qc = useQueryClient();
  return useMutation(
    async ({ id, payload }: { id: number; payload: any }) => {
      const { data } = await apiClient.put(`/groups/${id}`, payload);
      return data;
    },
    {
      onSuccess: () => qc.invalidateQueries(["groups"]),
    }
  );
}

export function useDeleteGroup() {
  const qc = useQueryClient();
  return useMutation(
    async (id: number) => {
      const { data } = await apiClient.delete(`/groups/${id}`);
      return data;
    },
    {
      onSuccess: () => qc.invalidateQueries(["groups"]),
    }
  );
}

export function useInviteMember() {
  const qc = useQueryClient();

  return useMutation(
    async ({ groupId, email }: { groupId: number; email: string }) => {
      try {
        const { data } = await apiClient.post(`/groups/${groupId}/invite`, { email });
        return data;
      } catch (err: any) {
        // normalize backend error: prefer response.data.detail when available
        const detail = err?.response?.data?.detail || err?.response?.data?.error || err?.message;
        throw new Error(detail ?? "Erro ao enviar convite");
      }
    },
    {
      onSuccess: (_data, variables) => {
        qc.invalidateQueries(["group", variables.groupId]);
        qc.invalidateQueries(["groups"]);
      },
    }
  );
}

export function useSetExpenseSplits() {
  const qc = useQueryClient();
  return useMutation(
    async ({ expenseId, splits }: { expenseId: number; splits: any[] }) => {
      const { data } = await apiClient.post(`/expenses/${expenseId}/split`, splits);
      return data;
    },
    {
      onSuccess: (_data, vars) => {
        qc.invalidateQueries(["expense", vars.expenseId]);
        qc.invalidateQueries(["expenses"]);
        if (vars && vars.splits && vars.splits.length) {
          qc.invalidateQueries(["group", vars.splits[0].group_id]); // best-effort
        }
      },
    }
  );
}