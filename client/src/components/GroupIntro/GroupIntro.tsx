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

  const totalTime = () => {
    let time = 0;
    group.parties.forEach((party) => {
      time += parseInt(party.duration);
    });
    return (time / 60).toFixed(0);
  };

  return (
    <div
      className={`group-intro ${group.groupMode === 'Duel' && 'group-intro-duel'}`}
      onClick={() => {
        navigate(`/group/${group._id}`);
      }}
    >
      <div className="group-intro__title">{group.groupName}</div>
      <div className="group-intro__items">
        <div className="group-intro__item item__game-mode">
          {group.groupMode === 'Duel' ? (
            <div className="duel">
              <img src={IconBorder} alt="" title="Тип групи 'Duel'" />
            </div>
          ) : (
            <div className="mPvP">
              <img src={IconBorder} alt="" title="Тип групи 'mPvP'" />
            </div>
          )}
        </div>
        <div className="group-intro__item item__games" title="Зіграно ігор">
          <span>{group.parties.length}</span>
          <img className="" src={IconGames} alt="" width="50" height="50" />
        </div>
        <div className="group-intro__item item__players" title="Кількість гравців">
          <span>{group.members.length}</span>
          <img className="" src={IconMPlayers} alt="" width="50" height="50" />
        </div>
        <div className="group-intro__item item__time" title="Зіграно годин">
          <span>{totalTime()}</span>
          <img className="" src={IconTime} alt="" width="50" height="50" />
        </div>
      </div>
    </div>
  );
};
