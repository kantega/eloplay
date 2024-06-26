/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export default function MinityrLeagueMatchHistory({
  eloList,
  length = 5,
}: {
  eloList: number[];
  length?: number;
}) {
  const reverseList = eloList.slice(0, length).reverse();
  const amountOfNoneMatches = 5 - eloList.length > 0 ? 5 - eloList.length : 0;
  return (
    <ul className="flex space-x-1">
      {[...Array(amountOfNoneMatches)].map((value, index) => (
        <li
          key={value + "" + index}
          className={`flex h-4 w-4 items-center justify-center rounded border-2`}
        >
          <p className="text-xs font-semibold text-gray-500">?</p>
        </li>
      ))}
      {reverseList.map((eloGain, index) => {
        return <MinityrMatchSymbol key={index} eloGain={eloGain} />;
      })}
    </ul>
  );
}

function MinityrMatchSymbol({ eloGain }: { eloGain: number }) {
  return (
    <li
      data-before=""
      className={`relative flex h-4 w-4 items-center justify-center rounded 
          last:before:absolute last:before:-bottom-1 last:before:h-[0.15rem] last:before:w-[70%] last:before:rounded-sm
          last:before:content-[attr(before)]  ${
            eloGain > 0
              ? "bg-primary last:before:bg-primary"
              : "bg-red-500 last:before:bg-red-500"
          }`}
    >
      <p className="text-xs font-semibold text-black">
        {eloGain > 0 ? "W" : "L"}
      </p>
    </li>
  );
}
