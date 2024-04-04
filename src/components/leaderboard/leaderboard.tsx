import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/router";
import MinityrStreakSymbol from "../leagueMatch/minityr-streak-symbol";
import { sortAndFilterForInactivePlayers } from "../leagueUser/league-user-utils";
import { Suspense, useState } from "react";
import { useTeamId, useTeamRole } from "@/contexts/teamContext/team-provider";
import { RoleTexts } from "@/server/types/roleTypes";
import { PencilLine } from "lucide-react";
import UpdateEloLeagueUserForm from "./update-elo-league-user-form";
import TooltipButton from "../ui/text-tooltip";
import { useUserId } from "@/contexts/authContext/auth-provider";
import TeamUserCard from "../teamUser/team-user-card";
import { api } from "@/utils/api";
import { useLeagueId } from "@/contexts/leagueContext/league-provider";
import { Skeleton } from "../ui/skeleton";

export default function Leaderboard({
  showInactivePlayers,
}: {
  showInactivePlayers: boolean;
}) {
  return (
    <Suspense fallback={<Skeleton className=" h-[60vh] w-full" />}>
      <InnerLeaderboard showInactivePlayers={showInactivePlayers} />
    </Suspense>
  );
}

function InnerLeaderboard({
  showInactivePlayers,
}: {
  showInactivePlayers: boolean;
}) {
  const teamId = useTeamId();
  const leagueId = useLeagueId();

  const [data] = api.leagueUser.getAllByLeagueId.useSuspenseQuery({
    leagueId,
    teamId,
  });

  const leagueUsers = data.leagueUsersAndTeamUsers;
  const router = useRouter();
  const userId = useUserId();

  const filtedLeagueUsers = sortAndFilterForInactivePlayers(
    leagueUsers,
    showInactivePlayers,
    userId,
  );

  let previousElo = -1;
  let previousIndex = 0;

  return (
    <Table className="m-0 w-[min(700px,100%)] p-0">
      <TableBody className="m-0 p-0">
        {filtedLeagueUsers.map((player, index) => {
          const currentElo = player.leagueUser.elo;
          let currentEloIndex = index;

          if (previousElo === currentElo) {
            currentEloIndex = previousIndex;
          }
          previousIndex = currentEloIndex;
          previousElo = currentElo;

          return (
            <TableRow key={player.leagueUser.id}>
              <TableCell
                onClick={async () => {
                  await router.push("/leagueUser/" + player.leagueUser.id);
                }}
              >
                <TeamUserCard
                  player={player}
                  currentEloIndex={currentEloIndex}
                />
              </TableCell>
              <TableCell
                className="px-0"
                onClick={async () => {
                  await router.push("/leagueUser/" + player.leagueUser.id);
                }}
              >
                {Math.abs(player.leagueUser.streak) > 3 && (
                  <MinityrStreakSymbol streak={player.leagueUser.streak} />
                )}
              </TableCell>
              <TableCell className="px-0">
                <LeagueUserElo
                  elo={player.leagueUser.elo}
                  leagueUserId={player.leagueUser.id}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function LeagueUserElo({
  elo,
  leagueUserId,
}: {
  elo: number;
  leagueUserId: string;
}) {
  const role = useTeamRole();
  const [edit, setEdit] = useState(false);

  if (role === RoleTexts.ADMIN && edit)
    return (
      <UpdateEloLeagueUserForm
        value={elo}
        leagueUserId={leagueUserId}
        setEdit={setEdit}
      />
    );

  return (
    <div className="relative flex flex-col items-end">
      <p className="text-xl">{elo}</p>
      <p className="space-x-1 text-sm text-gray-500">
        <b>ELO</b>
        {role === RoleTexts.ADMIN && (
          <TooltipButton
            text={"ADMIN INTERFACE"}
            className=" m-0 aspect-square h-fit w-fit bg-transparent pl-2 text-primary"
            onClick={() => setEdit(!edit)}
          >
            <PencilLine size={12} className="p-0 text-foreground" />
          </TooltipButton>
        )}
      </p>
    </div>
  );
}
