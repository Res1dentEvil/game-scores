import React from 'react';
import { getAvatar } from '../../helpers/getAvatar';
import Player from '../../assets/img/players4.svg';
import Cup from '../../assets/img/wincup.png';
import { IGroup } from '../../types';
import { MemberData } from '../../helpers/getMemberTableData';

interface HighestAverageScoreWinnerProps {
  groupState: IGroup;
  sortedData: Record<string, MemberData>;
}

export const HighestAverageScoreWinner = ({
  groupState,
  sortedData,
}: HighestAverageScoreWinnerProps) => {
  return (
    <div className="group-page__dashboard-item winner-dashboard-item ">
      <div>
        <img
          src={
            getAvatar(Object.keys(sortedData)[0], groupState).length
              ? getAvatar(Object.keys(sortedData)[0], groupState)
              : Player
          }
          alt=""
          className="member-avatar"
          width={'60px'}
        ></img>
        <h3>Вітаємо, {Object.keys(sortedData)[0]}!</h3>
        <div className="dashboard-item__winner-description">Найвищий середній бал за гру</div>
        <div className="dashboard-item__win-rate">
          {sortedData[Object.keys(sortedData)[0]].averagePoint.toFixed(1)}
        </div>
      </div>

      <img className="dashboard-item__cup" src={Cup} alt="winner cup" />
    </div>
  );
};
