import React from 'react';
import './GroupIntro.scss';
import { IGroup } from '../../types';
import IconGames from '../../assets/img/games2.svg';
import IconMPlayers from '../../assets/img/players4.svg';
import IconTime from '../../assets/img/time.svg';
import IconBorder from '../../assets/img/border.svg';
import { useNavigate } from 'react-router-dom';

interface GroupIntroProps {
  group: IGroup;
}

export const GroupIntro = ({ group }: GroupIntroProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="group-intro"
      onClick={() => {
        navigate(`/group/${group._id}`);
      }}
    >
      <div className="group-intro__title">{group.groupName}</div>
      <div className="group-intro__items">
        <div className="group-intro__item item__game-mode">
          {group.groupMode === 'Duel' ? (
            <div className="duel">
              <img src={IconBorder} alt="" title="Duel mode" />
            </div>
          ) : (
            <div className="mPvP">
              <img src={IconBorder} alt="" title="mPvP mode" />
            </div>
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
        <div className="group-intro__item item__time" title="Зіграно часу">
          <span>0</span>
          <img className="" src={IconTime} alt="" width="70" height="70" />
        </div>
      </div>
    </div>
  );
};
