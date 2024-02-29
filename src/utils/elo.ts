export function updateEloRating(
  Ra: number,
  Rb: number,
  K = 30,
): [number, number] {
  // Calculate the expected score for each player
  const Ea: number = 1 / (1 + 10 ** ((Rb - Ra) / 400));
  const Eb: number = 1 / (1 + 10 ** ((Ra - Rb) / 400));

  // Determine the actual score based on the result
  const Sa = 1;
  const Sb = 0;

  // Update the Elo ratings
  const newRa: number = Ra + K * (Sa - Ea);
  const newRb: number = Rb + K * (Sb - Eb);

  return [Math.ceil(newRa), Math.floor(newRb)];
}
