import LeagueUserMatchHistory from "@/components/leagueMatch/league-user-match-history";
import SpecificLeagueUser from "@/components/leagueUser/specific-league-user";
import SearchBar from "@/components/search-bar";
import { useRouter } from "next/router";
import { useState } from "react";

export default function LeagueUserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <SpecificLeagueUser leagueUserId={id} />
      <div className="relative w-full">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={"Search for opponent..."}
        />
        <LeagueUserMatchHistory leagueUserId={id} searchQuery={searchQuery} />
      </div>
      <span className="py-6" />
    </div>
  );
}
