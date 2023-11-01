import React from 'react';
import './MembersTable.scss';
import { IGroup } from '../../types';
import Player from '../../assets/img/players4.svg';
import { getAvatar } from '../../helpers/getAvatar';

interface MembersTableProps {
  sortedData: Record<string, MemberData>;
  groupState: IGroup;
}

interface MemberData {
  playedGamesNames: string[];
  gamesWon: string[];
  points: number;
  winRate: number;
}

export const MembersTable = ({ sortedData, groupState }: MembersTableProps) => {
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
