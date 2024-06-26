import { useTeamId } from "@/contexts/teamContext/team-provider";
import { api } from "@/utils/api";
import { type League } from "@prisma/client";
import { PencilLine, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import ChangeLeagueName from "./change-league-name";
import LeagueDeleteDialog from "./league-delete-dialog";
import LoadingSpinner from "../loader/loading";
import MinorHeaderLabel from "../minor-header-label";
import TeamAdmin from "../auhtVisibility/team-admin";
import TeamModerator from "../auhtVisibility/team-moderator";

export default function TeamLeagueList() {
  const teamId = useTeamId();
  const { data, isLoading } = api.league.getAll.useQuery({ teamId });

  if (isLoading || !data) return <LoadingSpinner />;

  return (
    <>
      <MinorHeaderLabel headerText="League List" />
      <ul className="flex flex-col justify-center gap-2">
        {data.map((league) => (
          <LeagueItem key={league.id} league={league} />
        ))}
      </ul>
    </>
  );
}

function LeagueItem({ league }: { league: League }) {
  const [changeLeagueName, setChangeLeagueName] = useState(false);

  return (
    <li key={league.id} className=" flex w-full">
      <div className="flex w-[100%] justify-between">
        {!changeLeagueName && <h1 className=" text-md">{league.name}</h1>}
        {changeLeagueName && (
          <ChangeLeagueName
            leagueId={league.id}
            leagueName={league.name}
            setChangeLeagueName={setChangeLeagueName}
          />
        )}
        <span className="flex gap-8">
          <TeamModerator>
            <Button
              className=" aspect-square h-6 w-6"
              variant={!changeLeagueName ? "ghost" : "destructive"}
              size="icon"
              onClick={() => setChangeLeagueName(!changeLeagueName)}
            >
              {!changeLeagueName ? <PencilLine size={16} /> : <X size={10} />}
            </Button>
          </TeamModerator>
          {!changeLeagueName && (
            <TeamAdmin>
              <LeagueDeleteDialog league={league}>
                <Button
                  className=" aspect-square h-6 w-6"
                  variant="outline"
                  size="icon"
                >
                  <X size={16} />
                </Button>
              </LeagueDeleteDialog>
            </TeamAdmin>
          )}
        </span>
      </div>
    </li>
  );
}
