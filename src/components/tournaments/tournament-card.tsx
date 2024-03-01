import React from "react";
import { Card } from "../ui/card";
import MinorHeaderLabel from "../minor-header-label";
import IsOpenForRegistrationBadge from "./is-open-for-registration-badge";
import { type SwissTournament } from "@prisma/client";

export default function TournamentCard({
  tournament,
}: {
  tournament: SwissTournament;
}) {
  return (
    <Card className="relative p-2">
      <MinorHeaderLabel label="SWISS TOURNAMENT" headerText={tournament.name} />
      <p>{tournament.description}</p>
      <p>{tournament.roundLimit}</p>
      <IsOpenForRegistrationBadge isOpen={tournament.isOpen} />
    </Card>
  );
}
