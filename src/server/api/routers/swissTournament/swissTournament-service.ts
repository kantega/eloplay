import { type Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { type GetSwissTournament } from "./swiss-tournament-types";
import { type z } from "zod";

interface DeleteTournamentProps {
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  input: z.infer<typeof GetSwissTournament>;
}

export async function deleteSwissTournament({
  db,
  input,
}: DeleteTournamentProps) {
  const { tournamentId, teamId, leagueId } = input;

  await db.swissTournamentUser.deleteMany({
    where: {
      swissTournamentId: tournamentId,
      teamId,
      leagueId,
    },
  });

  await db.swissTournamentMatch.deleteMany({
    where: {
      tournamentId,
      teamId,
      leagueId,
    },
  });

  await db.swissTournament.delete({
    where: {
      teamId,
      leagueId,
      id: tournamentId,
    },
  });

  return true;
}

interface DeleteTournamentsProps {
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  input: Omit<z.infer<typeof GetSwissTournament>, "tournamentId">;
}

export async function deleteAllSwissTournamentsForLeague({
  db,
  input,
}: DeleteTournamentsProps) {
  const { leagueId, teamId } = input;
  await db.swissTournamentUser.deleteMany({
    where: {
      leagueId,
      teamId,
    },
  });
  await db.swissTournamentMatch.deleteMany({
    where: {
      leagueId,
      teamId,
    },
  });
  await db.swissTournament.deleteMany({
    where: {
      leagueId,
      teamId,
    },
  });

  return true;
}
