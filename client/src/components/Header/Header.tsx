import React from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';
import Logo from '../../assets/img/logo.jpg';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/reducers/ActionCreators';

const Header = () => {
  const { isAuth } = useAppSelector((state) => state.storeReducer);
  const dispatch = useAppDispatch();

  return (
    <div className="header">
      <nav className="nav">
        <div className="nav__logo">
          <Link className="nav__link" to="/">
            {/*<img src={Logo} alt="logo" className="logo-img" width="70px" />*/}
            The Last Kingdom
          </Link>
        </div>
        {isAuth && (
          <div className="nav__links">
            <Link className="nav__link" to="/groups">
              Всі групи
            </Link>
            <Link className="nav__link" to="/">
              Допомога
            </Link>
            <Link className="nav__link" to="/create-group">
              Створити групу
            </Link>
            <Link className="nav__link" to="/">
              Профіль
            </Link>
            UA
            <Link
              className="nav__link"
              to="/"
              onClick={() => {
                dispatch(logout());
              }}
            >
              Вихід
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
