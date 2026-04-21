export function buildUrl(
  current: Record<string, string | undefined>,
  overrides: Record<string,string>
): string{
  const merged = { ...current, ...overrides };
  const params = new URLSearchParams()
  for (const [key, val] of Object.entries(merged)) {
    if (val) params.set(key, val);
  }
  const qs = params.toString();
  return `/browse${qs ? `?${qs}` : ""}`;
}