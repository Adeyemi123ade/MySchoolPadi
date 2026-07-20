const ACCENTS = ["primary", "success", "warning", "secondary", "destructive"] as const;

export type CourseAccent = (typeof ACCENTS)[number];

/** Deterministic accent color per course, derived from its code — purely visual grouping, not a data field. */
export function courseAccent(code: string): CourseAccent {
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = (hash * 31 + code.charCodeAt(i)) >>> 0;
  return ACCENTS[hash % ACCENTS.length];
}
