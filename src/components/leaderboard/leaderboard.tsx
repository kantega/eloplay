import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/router";
import { getLatestEloList } from "@/server/api/routers/leagueMatch/league-match-utils";
import MinityrLeagueMatchHistory from "../leagueMatch/minityr-league-match-history";
import MinityrStreakSymbol from "../leagueMatch/minityr-streak-symbol";
import { type LeagueUserAndTeamUser } from "../leagueUser/league-user-types";
import { sortAndFilterForInactivePlayers } from "../leagueUser/league-user-utils";
import { useState } from "react";
import { useTeamRole } from "@/contexts/teamContext/team-provider";
import { RoleTexts } from "@/server/types/roleTypes";
import { PencilLine } from "lucide-react";
import UpdateEloLeagueUserForm from "./update-elo-league-user-form";
import TooltipButton from "../ui/text-tooltip";
import { useUserId } from "@/contexts/authContext/auth-provider";
import TeamUserImage from "../teamUser/team-user-image";

export default function Leaderboard({
  leagueUsers,
  showInactivePlayers,
}: {
  leagueUsers: LeagueUserAndTeamUser[];
  showInactivePlayers: boolean;
}) {
  const router = useRouter();
  const userId = useUserId();

  const filtedLeagueUsers = sortAndFilterForInactivePlayers(
    leagueUsers,
    showInactivePlayers,
    userId,
  );

  return (
    <Table className="m-0 w-[min(700px,100%)] p-0">
      <TableBody className="m-0 p-0">
        {filtedLeagueUsers.map((player, index) => {
          const eloGainList = getLatestEloList(player.leagueUser.latestEloGain);
          return (
            <TableRow key={player.leagueUser.id}>
              <TableCell
                className="w-14 px-0"
                onClick={async () => {
                  await router.push("/leagueUser/" + player.leagueUser.id);
                }}
              >
                <TeamUserImage image={player.teamUser.image} index={index} />
              </TableCell>
              <TableCell
                className="px-0 "
                onClick={async () => {
                  await router.push("/leagueUser/" + player.leagueUser.id);
                }}
              >
                <div className="flex flex-col items-start">
                  <p className="text-xl">{player.teamUser.gamerTag}</p>
                  <div className="flex items-center space-x-2">
                    {<MinityrLeagueMatchHistory eloList={eloGainList} />}
                    <p className="text-sm text-gray-500">
                      {player.leagueUser.matchCount -
                        player.leagueUser.matchLossCount}
                      -{player.leagueUser.matchLossCount}
                    </p>
                  </div>
                </div>
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
