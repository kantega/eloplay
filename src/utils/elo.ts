export const matchResults = {
  player111: "player111",
  player222: "player222",
} as const;

type MatchResult = (typeof matchResults)[keyof typeof matchResults];

export function updateEloRating(
  Ra: number,
  Rb: number,
  result: MatchResult,
  K = 30,
): [number, number] {
  // Calculate the expected score for each player
  const Ea: number = 1 / (1 + 10 ** ((Rb - Ra) / 400));
  const Eb: number = 1 / (1 + 10 ** ((Ra - Rb) / 400));

  // Determine the actual score based on the result
  let Sa: number, Sb: number;
  switch (result) {
    case matchResults.player111:
      Sa = 1;
      Sb = 0;
      break;
    case matchResults.player222:
      Sa = 0;
      Sb = 1;
      break;
  }

  // Update the Elo ratings
  const newRa: number = Ra + K * (Sa - Ea);
  const newRb: number = Rb + K * (Sb - Eb);

  return [Math.ceil(newRa), Math.ceil(newRb)];
}
