function getInitial(name: string | null | undefined): string {
  return name?.[0]?.toUpperCase() ?? "U";
}