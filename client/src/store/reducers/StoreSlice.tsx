import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import React from 'react';

import { IState, IUser, IUserGoogleAuthData, IUserGoogleProfile } from '../../types';

const initialState: IState = {
  isAuth: !!localStorage.getItem('token'),
  isLoading: false,
  currentUser: {} as IUser,
  userGoogleAuthData: {} as IUserGoogleAuthData,
  userGoogleProfile: {} as IUserGoogleProfile,
  error: '',
};

export const storeSlice = createSlice({
  name: 'myStore',
  initialState,
  reducers: {
    fetchingStart(state) {
      state.isLoading = true;
    },
    fetchingEnd(state) {
      state.isLoading = false;
    },
    authFetchingSuccess(state, action: PayloadAction<IUserGoogleAuthData>) {
      state.isAuth = true;
      state.isLoading = false;
      state.userGoogleAuthData = action.payload;
      state.error = '';
    },
    authFetchingError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      if (action.payload.length) {
        state.error = JSON.parse(action.payload).message;
      } else {
        state.error = action.payload;
      }
    },
    setUserGoogleProfile(state, action: PayloadAction<IUserGoogleProfile>) {
      state.userGoogleProfile = action.payload;
      state.isLoading = false;
    },
    logout(state) {
      state.isAuth = false;
      state.currentUser = {} as IUser;
      state.userGoogleAuthData = {} as IUserGoogleAuthData;
      state.userGoogleProfile = {} as IUserGoogleProfile;
      state.isLoading = false;
      localStorage.removeItem('token');
    },
    setCurrentUser(state, action: PayloadAction<IUser>) {
      state.currentUser = action.payload;
    },
  },
});

export default storeSlice.reducer;
