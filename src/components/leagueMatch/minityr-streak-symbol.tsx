export default function MinityrStreakSymbol({ streak }: { streak: number }) {
  console.log(streak);
  return (
    <p className="text-md m-0">{streak > 3 ? "🔥" : streak < -3 ? "🥶" : ""}</p>
  );
}
