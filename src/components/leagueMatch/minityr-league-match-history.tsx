export default function MinityrLeagueMatchHistory({
  eloList,
  length = 5,
}: {
  eloList: number[];
  length?: number;
}) {
  const reverseList = eloList.slice(0, length).reverse();
  return (
    <ul className="flex space-x-1">
      {reverseList.map((eloGain, index) => {
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
