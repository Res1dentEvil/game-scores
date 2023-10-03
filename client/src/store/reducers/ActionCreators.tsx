import axios, { AxiosError } from 'axios';
import { IAuthBody, IGroup, IUserGoogleAuthData, IUserGoogleProfile } from '../../types';
import { AppDispatch } from '../store';
import { storeSlice } from './StoreSlice';
import React from 'react';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export const baseURL = `http://localhost:5000`;
// const baseURL = `https://app-invoices-server-res1dentevil.onrender.com`;

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
          .then((res) => {
            dispatch(storeSlice.actions.setUserGoogleProfile(res.data));
            // console.log(res.data);
            dispatch(checkRegistration(res.data));
            dispatch(getCurrentUser(res.data.email));

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
          console.log(response.data);
          dispatch(storeSlice.actions.setCurrentUser(response.data));
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
