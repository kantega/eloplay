import { useRouter } from "next/router";
import MatchHistory from "./MatchHistory";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import PlayerCard from "./PlayerCard";
import PlayerEloGraph from "./PlayerEloGraph";
import PlayerOpponentRadar from "./PlayerOpponentRadar";
import PlayerRivals from "./PlayerRivals";

export default function PlayerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      {typeof id === "string" && (
        <PlayerCard id={id} searchQuery={searchQuery} />
      )}
      {typeof id === "string" && (
        <PlayerRivals id={id} searchQuery={searchQuery} />
      )}

      <div className="container flex flex-col justify-center gap-8 md:flex-row">
        {typeof id === "string" && (
          <PlayerEloGraph id={id} searchQuery={searchQuery} />
        )}
        {typeof id === "string" && (
          <PlayerOpponentRadar id={id} searchQuery={searchQuery} />
        )}
      </div>
      <Input
        placeholder="search for opponent..."
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value.currentTarget.value);
        }}
      />
      {typeof id === "string" && (
        <MatchHistory id={id} searchQuery={searchQuery} />
      )}
    </div>
  );
}
