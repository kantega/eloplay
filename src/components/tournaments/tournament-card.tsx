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
import { DeleteTournamentButton } from "./delete-swiss-button";

export default function TournamentCard({
  tournament,
  swissUser,
  teamUser,
  showDelete = true,
}: {
  tournament: SwissTournament;
  swissUser?: SwissTournamentUser;
  teamUser?: TeamUser;
  showDelete?: boolean;
}) {
  return (
    <Card className="relative p-2">
      <MinorHeaderLabel label="SWISS TOURNAMENT" headerText={tournament.name} />
      <br />
      {/* <p>{tournament.description}</p> */}
      {tournament.status === "PENDING" && (
        <p className="absolute right-2 top-8">
          Play
          <b className="text-primary">{" " + tournament.roundLimit}</b> rounds
        </p>
      )}
      {tournament.status === "IN_PROGRESS" && (
        <p className="absolute right-2 top-8">
          Playing round
          <b className="text-primary">{" " + tournament.currentRound}</b> of
          <b className="text-primary">{" " + tournament.roundLimit}</b>
        </p>
      )}
      {tournament.status === "COMPLETED" && (
        <p className="absolute right-2 top-8">
          Played <b className="text-primary">{" " + tournament.currentRound}</b>{" "}
          rounds
        </p>
      )}
      <TournamentStatusBadge
        status={tournament.status as MatchStatus}
        isOpen={tournament.isOpen}
      />
      {!!swissUser && !!teamUser && (
        <SwissUserCard teamUser={teamUser} swissUser={swissUser} />
      )}
      {showDelete && <DeleteTournamentButton tournament={tournament} />}
    </Card>
  );
}
