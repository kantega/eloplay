export default function MinityrLeagueMatchHistory({
  eloList,
}: {
  eloList: number[];
}) {
  return (
    <ul className="flex space-x-1">
      {eloList.slice(0, 5).map((eloGain, index) => {
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
      <p className="text-white">{eloGain > 0 ? "W" : "L"}</p>
    </li>
  );
}
