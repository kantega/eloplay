import { type TeamUser } from "@prisma/client";
import Image from "next/image";

export default function TeamMatchProfile({
  teamUser,
  preElo,
}: {
  teamUser: TeamUser;
  preElo: number;
}) {
  return (
    <div className="flex gap-4 p-1">
      <Image
        className="rounded-full"
        src={teamUser.image}
        alt="Team user profile image"
        width={40}
        height={40}
        quality={100}
      />
      <span className="flex flex-col">
        <p className="text-md text-left">{teamUser.gamerTag}</p>
        <p className="text-xs text-gray-500">ELO {preElo}</p>
      </span>
    </div>
  );
}
