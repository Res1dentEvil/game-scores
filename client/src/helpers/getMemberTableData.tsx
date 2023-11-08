import { IGroup } from '../types';
import { storeSlice } from '../store/reducers/StoreSlice';
import { useAppDispatch } from '../hooks/redux';

interface MemberData {
  playedGamesNames: string[];
  gamesWon: string[];
  points: number;
  winRate: number;
}

export const tableData = (
  groupState: IGroup,
  setSortedData: React.Dispatch<React.SetStateAction<Record<string, MemberData>>>
) => {
  const members = groupState.members.map((member) => member.memberName);
  const data: Record<string, MemberData> = {};

  for (const member of members) {
    data[member] = {
      playedGamesNames: [],
      gamesWon: [],
      points: 0,
      winRate: 0,
    };
  }

  members.forEach((name, i) => {
    groupState.parties.forEach((party) => {
      if (party.winners[0].name === name) {
        data[name].gamesWon.push(party.gameName);
        data[name].points += 3;
      } else if (party.winners[1].name === name) {
        data[name].points += 2;
      } else if (party.winners[2].name === name) {
        data[name].points += 1;
      }

      party.partyMembers.forEach((member) => {
        if (member.name === name) {
          data[name].playedGamesNames.push(party.gameName);
        }
      });
    });
  });

  for (const member in data) {
    data[member].winRate =
      (data[member].gamesWon.length / data[member].playedGamesNames.length) * 100;
  }

  setSortedData(
    Object.fromEntries(Object.entries(data).sort(([, a], [, b]) => b.winRate - a.winRate))
  );
};
