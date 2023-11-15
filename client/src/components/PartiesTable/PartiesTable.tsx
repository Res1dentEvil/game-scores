import React from 'react';
import './PartiesTable.scss';
import { IGroup } from '../../types';
import { formattingDate } from '../../helpers/formatingDate';
import Medal from '../../assets/img/medal.svg';
import MedalSilver from '../../assets/img/medal-silver.svg';
import MedalMid from '../../assets/img/medal-mid.svg';
import Cup1 from '../../assets/img/cup1.svg';

interface PartiesTableProps {
  groupState: IGroup;
}

export const PartiesTable = ({ groupState }: PartiesTableProps) => {
  const winnersCount = groupState.groupMode === 'Duel' ? 1 : 3;

  const memberPoint = (point: string) => {
    if (groupState.groupMode === 'Duel') {
      return '';
    }
    return `: ${point}`;
  };

  return (
    <div className="parties-table">
      <table>
        <tbody>
          <tr>
            <th>Дата</th>
            <th>Гра</th>
            <th>Учасники</th>
            <th>Переможці</th>
          </tr>
          {groupState.parties.reverse().map((party, index) => {
            return (
              <tr key={Date.now() + index}>
                <td>{formattingDate(party.date)}</td>
                <td>{party.gameName}</td>
                <td>
                  {party.partyMembers.map((member) => {
                    return (
                      <div key={Math.random() + party._id!}>
                        {member.name} {memberPoint(member.point)}
                      </div>
                    );
                  })}
                </td>
                <td>
                  {party.winners
                    .map((winner, i) => {
                      return (
                        <div className="winner" key={`winner${i}`}>
                          {i === 0 ? (
                            <img src={Medal} alt="medal-gold" width="13px" />
                          ) : i === 1 ? (
                            <img src={MedalSilver} alt="medal-silver" width="13px" />
                          ) : (
                            <img src={MedalMid} alt="medal-mid" width="13px" />
                          )}
                          {winner.name}
                        </div>
                      );
                    })
                    .slice(0, winnersCount)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
