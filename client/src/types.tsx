export interface IState {
  isAuth: boolean;
  isLoading: boolean;
  currentUser: IUser;
  userGoogleAuthData: IUserGoogleAuthData;
  userGoogleProfile: IUserGoogleProfile;
  error: string;
}

export interface IUser {
  userName: string;
  email: string;
  picture: string;
  groups: string[];
  roles: string[];
}

export interface IAuthBody {
  id: string;
  name: string;
  email: string;
  picture: string;
}
export interface IUserGoogleAuthData {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface IUserGoogleProfile {
  email: string;
  family_name: string;
  given_name: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export interface IGroup {
  _id?: string;
  groupName: string;
  groupMode: string;
  members: IGroupMember[];
  administrators: [{ userName: string; email: string }];
  parties: IParty[];
  isPremium: boolean;
}

export interface IParty {
  date: Date;
  gameName: string;
  duration: number;
  partyMembers: IGroupMember[];
  winners: string[];
  winDescription: string;
}

export interface IGroupMember {
  memberName: string;
  email: string;
  avatar: string;
  memberParties: IParty[];
  roles: string[];
}
