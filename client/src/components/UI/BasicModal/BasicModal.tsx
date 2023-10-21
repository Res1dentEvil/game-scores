import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, FormControl, Input, InputLabel, MenuItem, TextField } from '@mui/material';
import { Formik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { Dispatch, SetStateAction, useState } from 'react';
import Select from '@mui/material/Select';
import { storeSlice } from '../../../store/reducers/StoreSlice';
import { IGroup, IGroupMember, IParty } from '../../../types';
import { createGroup, createGroupMember, getGroup } from '../../../store/reducers/ActionCreators';
import { DynamicForm } from '../../DynamicForm/DynamicForm';

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
  const [errors, setErrors] = useState('');

  const handleSubmit = async (e: React.MouseEvent) => {
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

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
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
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Додати учасника
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
