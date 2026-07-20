"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/fetch-json";

interface School {
  id: string;
  name: string;
}

/** Schools list for the registration picker. Public endpoint — no auth required. */
export function useSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: () => fetchJson<School[]>("/api/schools"),
    staleTime: 5 * 60 * 1000,
  });
}
