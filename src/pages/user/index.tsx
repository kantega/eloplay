import LoadingSpinner from "@/components/loading";
import MessageBox from "@/components/message-box";
import TeamAndTeamUserProfile from "@/components/teamUser/team-and-team-user-profile";
import { api } from "@/utils/api";

export default function UserPage() {
  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4">
      <AllTeamUserProfilesAndTeams />
    </div>
  );
}

function AllTeamUserProfilesAndTeams() {
  const { data, isLoading } = api.teamUser.getAll.useQuery();
  if (isLoading) return <LoadingSpinner />;
  if (!data) return <MessageBox>No team users found</MessageBox>;

  return (
    <ul className="space-y-4 ">
      {data.map((teamUserAndTeam) => {
        return (
          <TeamAndTeamUserProfile
            key={teamUserAndTeam.teamUser.id}
            {...teamUserAndTeam}
          />
        );
      })}
    </ul>
  );
}
