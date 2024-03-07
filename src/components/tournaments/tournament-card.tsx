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
      {tournament.isOpen && (
        <p>
          The tournament goes for
          <b className="text-primary">{" " + tournament.roundLimit}</b> rounds
        </p>
      )}
      {!tournament.isOpen && (
        <p>
          Playing round
          <b className="text-primary">{" " + tournament.currentRound}</b> out of
          <b className="text-primary">{" " + tournament.roundLimit}</b> rounds
        </p>
      )}
      <TournamentStatusBadge
        status={tournament.status as MatchStatus}
        isOpen={tournament.isOpen}
      />
    </Card>
  );
}
