import React, { useEffect, useState } from 'react';
import './MembersTable.scss';
import { IGroup } from '../../types';
import Player from '../../assets/img/players4.svg';
import { getAvatar } from '../../helpers/getAvatar';

interface MembersTableProps {
  groupState: IGroup;
}

interface MemberData {
  playedGamesNames: string[];
  gamesWon: string[];
  points: number;
  winRate: number;
}

export const MembersTable = ({ groupState }: MembersTableProps) => {
  const [sortedData, setSortedData] = useState<Record<string, MemberData>>({});

  useEffect(() => {
    tableData();
  }, []);

  const tableData = () => {
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

    return sortedData;
  };

  return (
    <div className="members-table">
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Гравець</th>
            <th>Зіграно ігр</th>
            {groupState.groupMode === 'Duel' ? null : <th>Балів за гру</th>}

            <th>Перемог</th>
          </tr>
          {Object.entries(sortedData).map(([name, player], i) => {
            return (
              <tr key={name} className="table-member-row" onClick={() => alert('open player')}>
                <td>{i + 1}</td>
                <td className="table-item__member">
                  <div>
                    <img
                      src={
                        getAvatar(name, groupState).length ? getAvatar(name, groupState) : Player
                      }
                      alt=""
                      className="member-avatar"
                      width={'30px'}
                    ></img>
                    {name}
                  </div>
                </td>
                <td>{player.playedGamesNames.length}</td>
                {groupState.groupMode === 'Duel' ? null : <td>{player.points}</td>}
                <td>{player.winRate.toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
