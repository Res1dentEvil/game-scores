import React from 'react';
import './GroupIntro.scss';
import { IGroup } from '../../types';
import IconGames from '../../assets/img/games.svg';
import IconMPlayers from '../../assets/img/players.svg';
import IconModeDuel from '../../assets/img/duel.png';
import IconModePvP from '../../assets/img/mpvp.png';

interface GroupIntroProps {
  group: IGroup;
}

export const GroupIntro = ({ group }: GroupIntroProps) => {
  return (
    <div className="group-intro">
      <div className="group-intro__title">{group.groupName}</div>
      <div className="group-intro__items">
        <div className="group-intro__item item__game-mode">
          {group.groupMode === 'Duel' ? (
            <img className="duel" src={IconModeDuel} alt="" title="Duel mode" />
          ) : (
            <img className="" src={IconModePvP} alt="" title="mPvP mode" />
          )}
        </div>
        <div className="group-intro__item item__games" title="Зіграно ігор">
          <span>{group.parties.length}</span>
          <img className="" src={IconGames} alt="" width="70" height="70" />
        </div>
        <div className="group-intro__item item__players" title="Кількість гравців">
          <span>{group.members.length}</span>
          <img className="" src={IconMPlayers} alt="" width="70" height="70" />
        </div>
      </div>
    </div>
  );
};
