"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Payment } from "@/types";

/** The current user's own payment history, newest first. Empty for most accounts today — no payment provider is wired up yet (see README). */
export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => fetchJson<Payment[]>("/api/payments"),
    staleTime: 60 * 1000,
  });
}
