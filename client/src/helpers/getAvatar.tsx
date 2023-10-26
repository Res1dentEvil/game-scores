import { IGroup } from '../types';

export const getAvatar = (name: string, groupState: IGroup) => {
  const member = groupState.members.filter((member) => {
    return member.memberName === name;
  });
  return member[0].avatar;
};
