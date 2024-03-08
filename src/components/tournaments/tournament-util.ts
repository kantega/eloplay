import { type SwissTournament } from "@prisma/client";

export function filterTournaments(
  members: SwissTournament[],
  searchQuery: string,
) {
  const letters = searchQuery.split("");

  const filteredTeamUsers = members.filter((member) => {
    return letters.reduce(
      (acc, letter) => {
        if (!acc.state) return { state: acc.state, name: acc.name };
        const includesLetter = acc.name.includes(letter.toLowerCase());
        return {
          state: includesLetter,
          name: acc.name.replace(letter.toLowerCase(), ""),
        };
      },
      {
        state: true,
        name: member.name?.toLowerCase() ?? "",
      },
    ).state;
  });

  return filteredTeamUsers.reverse();
}
