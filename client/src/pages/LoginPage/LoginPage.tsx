import React from 'react';
import GoogleLogo from '../../assets/img/google.png';
import './LoginPage.scss';
import Lineage from '../../assets/img/lineage.jpg';
import Kingdom from '../../assets/img/kingdom.jpg';

interface ILoginPageProps {
  login: () => void;
}

const LoginPage = ({ login }: ILoginPageProps) => {
  return (
    <div className="login-page">
      {/*<div className="login-page__img"></div>*/}
      {/*<img className="login-page__img" src={Kingdom} alt="Lineage-bg" />*/}

      <h2 className="login-page__h2">The Last Kingdom</h2>
      <button className="btn_google" onClick={() => login()}>
        Sign in with Google
        <img src={GoogleLogo} alt="GoogleLogo" width="27px" />
      </button>
    </div>
  );
};

export default LoginPage;
