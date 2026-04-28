const PLAYERS = [
  { aliases: ["curry", "stephen curry"], query: "curry", cat: "Sneakers" },
  { aliases: ["lebron"], query: "lebron", cat: "Sneakers" },
  { aliases: ["kobe"], query: "kobe", cat: "Sneakers" },
  { aliases: ["jordan", "michael jordan"], query: "jordan", cat: "Sneakers" },
  { aliases: ["kd", "kevin durant"], query: "kd", cat: "Sneakers" },
  { aliases: ["ja", "ja morant"], query: "ja", cat: "Sneakers" },
  { aliases: ["kyrie"], query: "kyrie", cat: "Sneakers" },
  { aliases: ["giannis"], query: "giannis", cat: "Sneakers" },
  { aliases: ["paul george", "pg"], query: "pg", cat: "Sneakers" },
  { aliases: ["luka"], query: "luka", cat: "Sneakers" },
  { aliases: ["zion"], query: "zion", cat: "Sneakers" },
  { aliases: ["tatum"], query: "tatum", cat: "Sneakers" },
  { aliases: ["ronaldo"], query: "ronaldo", cat: "Shoes" },
  { aliases: ["messi"], query: "messi", cat: "Shoes" },
  { aliases: ["neymar"], query: "neymar", cat: "Shoes" },
  { aliases: ["mbappe"], query: "mbappe", cat: "Shoes" },
] as const;

export const PLAYER_ROUTES: Record<string, string> = Object.fromEntries(
  PLAYERS.flatMap(({ aliases, query, cat }) =>
    aliases.map(alias => [alias, `/browse?q=${query}&cat=${cat}`])
  )
);