import React from "react";
import { Card } from "../ui/card";
import MinorHeaderLabel from "../minor-header-label";
import { type MatchStatus, type SwissTournament } from "@prisma/client";
import TournamentStatusBadge from "./tournament-status-badge";

export default function TournamentCard({
  tournament,
}: {
  tournament: SwissTournament;
}) {
  return (
    <Card className="relative p-2">
      <MinorHeaderLabel label="SWISS TOURNAMENT" headerText={tournament.name} />
      <p>{tournament.description}</p>
      {tournament.status === "PENDING" && (
        <p>
          Tournament will go for
          <b className="text-primary">{" " + tournament.roundLimit}</b> rounds
        </p>
      )}
      {tournament.status === "IN_PROGRESS" && (
        <p>
          Playing round
          <b className="text-primary">{" " + tournament.currentRound}</b> out of
          <b className="text-primary">{" " + tournament.roundLimit}</b> rounds
        </p>
      )}
      {tournament.status === "COMPLETED" && (
        <p>
          All
          <b className="text-primary">{" " + tournament.currentRound}</b> rounds
          have been played!
        </p>
      )}
      <TournamentStatusBadge
        status={tournament.status as MatchStatus}
        isOpen={tournament.isOpen}
      />
    </Card>
  );
}
