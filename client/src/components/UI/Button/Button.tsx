import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Button.scss';

interface IButtonProps {
  value: string;
  img?: string;
  navigateRoute?: string;
}

export const Button = ({ value, img, navigateRoute }: IButtonProps) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate(`${navigateRoute}`);
      }}
    >
      {value}
    </button>
  );
};
