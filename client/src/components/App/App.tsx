import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getGoogleProfile } from '../../store/reducers/ActionCreators';
import { IUserGoogleProfile } from '../../types';
import { storeSlice } from '../../store/reducers/StoreSlice';
import './App.scss';
import Header from '../Header/Header';
import GoogleLogo from '../../assets/img/google.png';
import Preloader from '../UI/Preloader/Preloader';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProfilePage from '../../pages/ProfilePage/ProfilePage';
import LoginPage from '../../pages/LoginPage/LoginPage';
import { CreateGroupPage } from '../../pages/CreateGroupPage/CreateGroupPage';
import { AllGroupsPage } from '../../pages/AllGroupsPage/AllGroupsPage';
import { GroupPage } from '../../pages/GroupPage/GroupPage';
import { CreatePartyPage } from '../../pages/CreatePartyPage/CreatePartyPage';

export const App = () => {
  const { userGoogleAuthData, userGoogleProfile, isLoading, isAuth } = useAppSelector(
    (state) => state.storeReducer
  );
  const dispatch = useAppDispatch();

  const login = useGoogleLogin({
    /* tslint:disable-next-line */
    onSuccess: (codeResponse) => {
      dispatch(storeSlice.actions.authFetchingSuccess(codeResponse));
      localStorage.setItem('token', codeResponse.access_token);
    },
    onError: (error) => console.log('LoginPage Failed:', error),
  });

  useEffect(() => {
    dispatch(getGoogleProfile(userGoogleAuthData));
  }, [userGoogleAuthData]);

  return (
    <div className="app__wrapper">
      <Header />

      <div className="main__wrapper">
        {isAuth ? (
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create-group" element={<CreateGroupPage />} />
            <Route path="/groups" element={<AllGroupsPage />} />
            <Route path="/group/:id" element={<GroupPage />} />
            <Route path="/group/:id/create-party" element={<CreatePartyPage />} />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage login={login} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </div>
  );
};
export default App;
