import React from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/reducers/ActionCreators';

const Header = () => {
  const { isAuth } = useAppSelector((state) => state.storeReducer);
  const dispatch = useAppDispatch();

  const burgerOpen = () => {
    const nav = document.querySelector('nav');
    nav!.classList.toggle('is-open');
  };

  const burgerClose = () => {
    const nav = document.querySelector('nav');
    nav!.classList.toggle('is-open');
  };

  return (
    <div className="header">
      <nav className="nav">
        <div className="nav__logo">
          <Link className="nav__link" to="/">
            The Last Kingdom
          </Link>
        </div>
        {isAuth && (
          <div className="nav__links">
            <Link className="nav__link" to="/groups" onClick={burgerClose}>
              Всі групи
            </Link>
            <Link className="nav__link" to="/" onClick={burgerClose}>
              Допомога
            </Link>
            <Link className="nav__link" to="/create-group" onClick={burgerClose}>
              Створити групу
            </Link>
            <Link className="nav__link" to="/" onClick={burgerClose}>
              Профіль
            </Link>
            UA
            <Link
              className="nav__link"
              to="/"
              onClick={() => {
                dispatch(logout());
                burgerClose();
              }}
            >
              Вихід
            </Link>
          </div>
        )}
      </nav>

      <div className="hamburger" id="hamburger-10" onClick={burgerOpen}>
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>
    </div>
  );
};

export default Header;
