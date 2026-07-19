"use client";

import { useQuery } from "@tanstack/react-query";

interface School {
  id: string;
  name: string;
}

async function fetchSchools(): Promise<School[]> {
  const res = await fetch("/api/schools");
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? "Failed to load schools");
  return json.data;
}

/** Schools list for the registration picker. Public endpoint — no auth required. */
export function useSchools() {
  return useQuery({ queryKey: ["schools"], queryFn: fetchSchools, staleTime: 5 * 60 * 1000 });
}
