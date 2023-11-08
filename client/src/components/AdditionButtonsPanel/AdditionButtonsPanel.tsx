import React from 'react';

interface AdditionButtonsPanelProps {
  handleOpenModalMembers: () => void;
  handleOpenModalGame: () => void;
  isAdmin: boolean;
}

export const AdditionButtonsPanel = ({
  handleOpenModalMembers,
  handleOpenModalGame,
  isAdmin,
}: AdditionButtonsPanelProps) => {
  if (!isAdmin) {
    return (
      <div className="group-page__row">
        <h5>Тут ще нічого немає</h5>
      </div>
    );
  }

  return (
    <div className="group-page__row">
      <button
        onClick={() => {
          handleOpenModalMembers();
        }}
      >
        Додати нових учасників
      </button>

      <button
        onClick={() => {
          handleOpenModalGame();
        }}
      >
        Додати гру до мого списку
      </button>
    </div>
  );
};
