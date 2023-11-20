import axios, { AxiosError } from 'axios';
import {
  IAuthBody,
  IGroup,
  IGroupMember,
  IParty,
  IUser,
  IUserGoogleAuthData,
  IUserGoogleProfile,
} from '../../types';
import { AppDispatch } from '../store';
import { storeSlice } from './StoreSlice';
import React, { Dispatch, SetStateAction } from 'react';
import { googleLogout } from '@react-oauth/google';

// export const baseURL = `http://localhost:5000`;
const baseURL = `https://game-board.onrender.com`;

export const getGoogleProfile =
  (userGoogleAuthData: IUserGoogleAuthData) => async (dispatch: AppDispatch) => {
    // const token = localStorage.getItem('token');
    try {
      if (localStorage.getItem('token')) {
        dispatch(storeSlice.actions.fetchingStart());

        const response = await axios
          .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${localStorage.getItem(
              'token'
            )}`,
            {
              headers: {
                Authorization: `Bearer ${userGoogleAuthData.access_token}`,
                Accept: 'application/json',
              },
            }
          )
          .then(async (res) => {
            await dispatch(storeSlice.actions.setUserGoogleProfile(res.data));
            // console.log(res.data);
            await dispatch(checkRegistration(res.data));
            await dispatch(getCurrentUser(res.data.email));

            dispatch(storeSlice.actions.fetchingEnd());
          });
      } else {
        console.log('auth error');
      }
    } catch (e) {
      dispatch(storeSlice.actions.logout());
      dispatch(storeSlice.actions.fetchingEnd());
      console.log(e);
    }
  };

export const checkRegistration = (body: IAuthBody) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios
      .post(`${baseURL}/api/auth/registration`, body, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        // console.log(response.data.message);
        dispatch(storeSlice.actions.fetchingEnd());
      });
  } catch (e) {
    const error = e as AxiosError;
    dispatch(storeSlice.actions.authFetchingError(JSON.stringify(error.response?.data)));
    dispatch(storeSlice.actions.fetchingEnd());
  }
};

export const logout = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(storeSlice.actions.fetchingStart());
    googleLogout();
    dispatch(storeSlice.actions.setUserGoogleProfile({} as IUserGoogleProfile));
    dispatch(storeSlice.actions.logout());
  } catch (e) {
    const error = e as AxiosError;
  }
};

export const createGroup =
  (
    body: IGroup,
    setIsShowAlertSuccess: (arg0: boolean) => void,
    setIsShowAlertError: (arg0: boolean) => void,
    redirectFunc: () => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(storeSlice.actions.fetchingStart());
      const response = await axios
        .post(`${baseURL}/api/group/create`, body, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
          // console.log(response.data);
          dispatch(getCurrentUser(response.data.email));
          dispatch(storeSlice.actions.fetchingEnd());

          if (response.status === 200) {
            setIsShowAlertSuccess(true);
            redirectFunc();
          }
        });
    } catch (e) {
      const error = e as AxiosError;
      setIsShowAlertError(true);
      dispatch(storeSlice.actions.fetchingEnd());
    }
  };

export const getCurrentUser = (data: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios
      .post(
        `${baseURL}/api/auth/user`,
        { data },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        dispatch(storeSlice.actions.setCurrentUser(response.data));
        dispatch(storeSlice.actions.fetchingEnd());
      });
  } catch (e) {
    const error = e as AxiosError;
    dispatch(storeSlice.actions.fetchingEnd());
  }
};

export const getProfileGroups =
  (
    data: string[],
    setProfileGroups: (arg0: []) => void,
    setLoadingProfile: (arg0: boolean) => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios
        .post(
          `${baseURL}/api/group/profile/groups`,
          { data },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((response) => {
          // console.log(response.data);
          setProfileGroups(response.data);
          setLoadingProfile(false);
          dispatch(storeSlice.actions.fetchingEnd());
        });
    } catch (e) {
      const error = e as AxiosError;
      dispatch(storeSlice.actions.fetchingEnd());
      setLoadingProfile(false);
    }
  };

export const getGroup =
  (id: string, setGroupState: Dispatch<SetStateAction<IGroup>>) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios
        .get(`${baseURL}/api/group/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          // console.log(response.data.followers);
          setGroupState(response.data);
          dispatch(storeSlice.actions.fetchingEnd());
        });
    } catch (e) {
      const error = e as AxiosError;
      dispatch(storeSlice.actions.fetchingEnd());
    }
  };

export const getAllGroups =
  (
    setAllGroups: Dispatch<SetStateAction<IGroup[]>>,
    setFilteredGroups: Dispatch<SetStateAction<IGroup[]>>
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios
        .get(`${baseURL}/api/group`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          // console.log(response.data);
          setAllGroups(response.data);
          setFilteredGroups(response.data);
          dispatch(storeSlice.actions.fetchingEnd());
        });
    } catch (e) {
      const error = e as AxiosError;
      dispatch(storeSlice.actions.fetchingEnd());
    }
  };

export const deleteGroup = (id: string, user: IUser) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios
      .delete(`${baseURL}/api/group/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => {
        dispatch(getCurrentUser(user.email));
      });
  } catch (e) {
    const error = e as AxiosError;
  }
};

export const createGroupMember =
  (body: {
    groupID: string;
    memberName: string;
    email: string;
    avatar: string;
    memberParties: IParty[];
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(storeSlice.actions.fetchingStart());
      const response = await axios
        .post(`${baseURL}/api/member/create`, body, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
          // console.log(response.data);
          dispatch(storeSlice.actions.fetchingEnd());
        });
    } catch (e) {
      const error = e as AxiosError;
      dispatch(storeSlice.actions.fetchingEnd());
    }
  };

export const createGroupGame =
  (body: { groupID: string; title: string; image: string }) => async (dispatch: AppDispatch) => {
    try {
      dispatch(storeSlice.actions.fetchingStart());
      const response = await axios
        .post(`${baseURL}/api/game/create`, body, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
          console.log(response.data);
          dispatch(storeSlice.actions.fetchingEnd());
        });
    } catch (e) {
      const error = e as AxiosError;
      dispatch(storeSlice.actions.fetchingEnd());
    }
  };

export const createParty = (party: IParty, groupID: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios
      .post(
        `${baseURL}/api/party/create`,
        { party, groupID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        dispatch(storeSlice.actions.fetchingEnd());
      });
  } catch (e) {
    const error = e as AxiosError;
    dispatch(storeSlice.actions.fetchingEnd());
  }
};

export const subscribeGroup =
  (groupID: string, userID: string, setGroupState: React.Dispatch<React.SetStateAction<IGroup>>) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios
        .post(
          `${baseURL}/api/group/subscribe`,
          { groupID, userID },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((response) => {
          getGroup(groupID, setGroupState);
          dispatch(storeSlice.actions.fetchingEnd());
        });
    } catch (e) {
      const error = e as AxiosError;
      dispatch(storeSlice.actions.fetchingEnd());
    }
  };

export const unSubscribeGroup =
  (groupID: string, userID: string, setGroupState: React.Dispatch<React.SetStateAction<IGroup>>) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios
        .post(
          `${baseURL}/api/group/unsubscribe`,
          { groupID, userID },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((response) => {
          // getGroup(groupID, setGroupState);
          dispatch(storeSlice.actions.fetchingEnd());
        });
    } catch (e) {
      const error = e as AxiosError;
      dispatch(storeSlice.actions.fetchingEnd());
    }
  };
