import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { useContext } from "react";

export default function TeamLeagueList() {
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.league.findAll.useQuery({ id: teamId });

  if (isLoading || !data) return null;

  return (
    <ul className="flex flex-col justify-center gap-1">
      {data.map((league) => {
        return (
          <li key={league.id} className=" flex gap-4">
            {league.name}
          </li>
        );
      })}
    </ul>
  );
}
