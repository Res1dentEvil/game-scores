import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { Dispatch, SetStateAction, useState } from 'react';
import { storeSlice } from '../../../store/reducers/StoreSlice';
import { IGroup } from '../../../types';
import {
  createGroupGame,
  createGroupMember,
  getGroup,
} from '../../../store/reducers/ActionCreators';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  // bgcolor: 'background.paper',
  // border: '2px solid #000',
  // boxShadow: 24,
  p: 4,
};

interface IModalProps {
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  openModal: boolean;
  modalType: string;
  groupID: string;
  setGroupState: Dispatch<SetStateAction<IGroup>>;
}

interface IFormikErrors {
  memberName: string;
}

export default function BasicModal({
  handleOpenModal,
  handleCloseModal,
  openModal,
  modalType,
  groupID,
  setGroupState,
}: IModalProps) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.storeReducer);

  const [memberName, setMemberName] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [gameImage, setGameImage] = useState('');

  const [errors, setErrors] = useState('');

  const handleSubmitMember = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!memberName) {
      setErrors('member name field cannot be empty');
      dispatch(storeSlice.actions.fetchingEnd());
      return;
    }

    const newMember = {
      groupID: groupID,
      memberName: memberName,
      email: '',
      avatar: '',
      memberParties: [],
    };

    await dispatch(createGroupMember(newMember));
    await dispatch(getGroup(groupID, setGroupState));
    setMemberName('');
    setErrors('');
    (document.getElementById('form__create-member')! as HTMLFormElement).reset();
    handleCloseModal();
    dispatch(storeSlice.actions.fetchingEnd());
  };

  const handleSubmitGame = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!gameTitle) {
      setErrors('title field cannot be empty');
      dispatch(storeSlice.actions.fetchingEnd());
      return;
    }

    const game = {
      groupID: groupID,
      title: gameTitle,
      image: gameImage,
    };

    await dispatch(createGroupGame(game));
    await dispatch(getGroup(groupID, setGroupState));
    setGameTitle('');
    setGameImage('');
    setErrors('');
    (document.getElementById('form__create-member')! as HTMLFormElement).reset();
    handleCloseModal();
    dispatch(storeSlice.actions.fetchingEnd());
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {modalType === 'member' ? (
          <Box sx={style}>
            <form className="form" id="form__create-member">
              <h2>Додати учасника</h2>
              <div className="input__container">
                <TextField
                  label="Ім'я учасника"
                  onChange={(e) => setMemberName(e.target.value)}
                  size="small"
                  value={memberName}
                />
              </div>
              <Button
                variant="contained"
                className="btn_registration"
                onClick={handleSubmitMember}
                disabled={isLoading}
              >
                Додати учасника
              </Button>
            </form>
          </Box>
        ) : (
          <Box sx={style}>
            <form className="form" id="form__create-member">
              <h2>Додати гру</h2>
              <div className="input__container">
                <TextField
                  label="Назва гри"
                  onChange={(e) => setGameTitle(e.target.value)}
                  size="small"
                  value={gameTitle}
                />
                <TextField
                  label="Посилання на іконку гри"
                  onChange={(e) => setGameImage(e.target.value)}
                  size="small"
                  value={gameImage}
                />
              </div>
              <Button
                variant="contained"
                className="btn_registration"
                onClick={handleSubmitGame}
                disabled={isLoading}
              >
                Додати гру
              </Button>
            </form>
          </Box>
        )}
      </Modal>
    </div>
  );
}
