"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Message, MessageWithDetails } from "@/types";

/** Messages visible to the current user (RLS-scoped), optionally filtered to one course. */
export function useMessages(params?: { courseId?: string }) {
  const search = new URLSearchParams();
  if (params?.courseId) search.set("courseId", params.courseId);

  return useQuery({
    queryKey: ["messages", params ?? {}],
    queryFn: () => fetchJson<MessageWithDetails[]>(`/api/messages${search.toString() ? `?${search}` : ""}`),
    staleTime: 30 * 1000,
  });
}

/** Sends a message to a course. Requires role lecturer/admin server-side. */
export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { courseId: string; body: string }) =>
      fetchJson<Message>("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message sent");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Deletes a message. */
export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fetchJson(`/api/messages/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
