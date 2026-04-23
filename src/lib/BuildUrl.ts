type Params = {
  q?: string;
  brand?: string;
  cat?: string;
  sort?: string;
  section?: string;
}

export function buildUrl(current: Params, overrides: Partial<Params>): string {
  const merged = { ...current, ...overrides };
  const query = new URLSearchParams();
  if (merged.q) query.set("q", merged.q);
  if (merged.brand) query.set("brand", merged.brand);
  if (merged.cat) query.set("cat", merged.cat);
  if (merged.sort) query.set("sort", merged.sort);
  if (merged.section) query.set("section", merged.section);
  return `/browse?${query.toString()}`;
}