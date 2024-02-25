export default function MinityrStreakSymbol({ streak }: { streak: number }) {
  return (
    <p className="text-md m-0">{streak > 3 ? "🔥" : streak < -3 ? "🥶" : ""}</p>
  );
}
