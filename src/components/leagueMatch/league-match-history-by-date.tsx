import LeagueMatchCard from "./league-match-card";
import DeleteLeagueMatchDialog from "./delete-league-match-dialog";
import { bucketByDate, checkForSpecialDateText } from "./league-match-util";
import { type LeagueMatchWithProfiles } from "../leagueUser/league-user-radar-graph";

export default function LeagueMatchHistoryByDate({
  sortedLeagueMatchesWithProfiles,
}: {
  sortedLeagueMatchesWithProfiles: LeagueMatchWithProfiles[];
}) {
  const buckets = bucketByDate(sortedLeagueMatchesWithProfiles);

  return (
    <>
      {Object.keys(buckets).map((date) => {
        return (
          <div key={date}>
            <h2 className="mb-1 mt-4 text-xl">
              {checkForSpecialDateText(date)}
            </h2>
            <ul>
              {buckets[date]?.map((leagueMatchWithProfiles) => {
                return (
                  <li key={leagueMatchWithProfiles.match.id}>
                    <DeleteLeagueMatchDialog
                      leagueMatch={leagueMatchWithProfiles.match}
                    >
                      <LeagueMatchCard {...leagueMatchWithProfiles} />
                    </DeleteLeagueMatchDialog>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <span className="py-10" />
    </>
  );
}
