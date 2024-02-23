import { TeamContext } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { type League } from "@prisma/client";
import { PencilLine, X } from "lucide-react";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { userIsAdmin, userIsModerator } from "@/utils/role";
import ChangeLeagueName from "./change-league-name";
import LeagueDeleteDialog from "./league-delete-dialog";
import LoadingSpinner from "../loading";

export default function TeamLeagueList() {
  const { teamId } = useContext(TeamContext);
  const { data, isLoading } = api.league.getAll.useQuery({ teamId });

  if (isLoading || !data) return <LoadingSpinner />;

  return (
    <ul className="flex flex-col justify-center gap-1">
      {data.map((league) => (
        <LeagueItem key={league.id} league={league} />
      ))}
    </ul>
  );
}

function LeagueItem({ league }: { league: League }) {
  const { role } = useContext(TeamContext);
  const [changeLeagueName, setChangeLeagueName] = useState(false);

  return (
    <li
      key={league.id}
      className=" flex w-full items-center justify-between gap-4"
    >
      <div className="flex w-[100%] justify-between">
        {!changeLeagueName && <h1 className=" text-md">{league.name}</h1>}
        <span className="flex items-center space-x-2">
          {changeLeagueName && (
            <ChangeLeagueName
              leagueId={league.id}
              leagueName={league.name}
              setChangeLeagueName={setChangeLeagueName}
            />
          )}
          {userIsModerator(role) && (
            <Button
              className=" aspect-square h-6 w-6"
              variant={!changeLeagueName ? "ghost" : "destructive"}
              size="icon"
              onClick={() => setChangeLeagueName(!changeLeagueName)}
            >
              {!changeLeagueName ? <PencilLine size={16} /> : <X size={10} />}
            </Button>
          )}
        </span>
        {userIsAdmin(role) && !changeLeagueName && (
          <LeagueDeleteDialog league={league}>
            <Button
              className=" aspect-square h-6 w-6"
              variant="outline"
              size="icon"
            >
              <X size={16} />
            </Button>
          </LeagueDeleteDialog>
        )}
      </div>
    </li>
  );
}
