"use client";

import LeagueUserMatchHistory from "@/components/leagueMatch/league-user-match-history";
import SpecificLeagueUser from "@/components/leagueUser/specific-league-user";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import { useState } from "react";

export default function PlayerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <SpecificLeagueUser leagueUserId={id} />
      <div className="relative w-full">
        <Input
          className="sticky top-16 z-10"
          placeholder="search for opponent..."
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value.currentTarget.value);
          }}
        />
        <LeagueUserMatchHistory leagueUserId={id} searchQuery={searchQuery} />
      </div>
      <span className="py-6" />
    </div>
  );
}
