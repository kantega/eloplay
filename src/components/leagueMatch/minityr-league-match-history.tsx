export default function MinityrLeagueMatchHistory({
  eloList,
  length = 5,
}: {
  eloList: number[];
  length?: number;
}) {
  return (
    <ul className="flex space-x-1">
      {eloList.slice(0, length).map((eloGain, index) => {
        return <MinityrMatchSymbol key={index} eloGain={eloGain} />;
      })}
    </ul>
  );
}

function MinityrMatchSymbol({ eloGain }: { eloGain: number }) {
  return (
    <li
      className={`flex h-4 w-4 items-center justify-center rounded ${
        eloGain > 0 ? "bg-primary" : "bg-red-500"
      }`}
    >
      <p className="text-xs font-semibold text-black">
        {eloGain > 0 ? "W" : "L"}
      </p>
    </li>
  );
}
