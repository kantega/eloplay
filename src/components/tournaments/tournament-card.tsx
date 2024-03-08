import React from "react";
import { Card } from "../ui/card";
import MinorHeaderLabel from "../minor-header-label";
import {
  type SwissTournamentUser,
  type MatchStatus,
  type SwissTournament,
  type TeamUser,
} from "@prisma/client";
import TournamentStatusBadge from "./tournament-status-badge";
import { SwissUserCard } from "./swiss-user-card";

export default function TournamentCard({
  tournament,
  swissUser,
  teamUser,
}: {
  tournament: SwissTournament;
  swissUser?: SwissTournamentUser;
  teamUser?: TeamUser;
}) {
  console.log(teamUser, swissUser);
  return (
    <Card className="relative p-2">
      <MinorHeaderLabel label="SWISS TOURNAMENT" headerText={tournament.name} />
      <br />
      {/* <p>{tournament.description}</p> */}
      {tournament.status === "PENDING" && (
        <p>
          Play
          <b className="text-primary">{" " + tournament.roundLimit}</b> rounds
        </p>
      )}
      {tournament.status === "IN_PROGRESS" && (
        <p>
          Playing round
          <b className="text-primary">{" " + tournament.currentRound}</b> of
          <b className="text-primary">{" " + tournament.roundLimit}</b>
        </p>
      )}
      {tournament.status === "COMPLETED" && (
        <p>
          Played <b className="text-primary">{" " + tournament.currentRound}</b>{" "}
          rounds
        </p>
      )}
      <TournamentStatusBadge
        status={tournament.status as MatchStatus}
        isOpen={tournament.isOpen}
      />
      {!!swissUser && !!teamUser && (
        <div className="absolute bottom-0 right-0 rounded-sm border-2 border-solid border-primary">
          <SwissUserCard teamUser={teamUser} swissUser={swissUser} />
        </div>
      )}
    </Card>
  );
}
