import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import Preloader from '../../components/UI/Preloader/Preloader';
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Snackbar,
  TextField,
} from '@mui/material';
import Select from '@mui/material/Select';
import './CreateGroupPage.scss';
import { storeSlice } from '../../store/reducers/StoreSlice';
import { IGroup, IGroupMember, IParty } from '../../types';
import { createGroup } from '../../store/reducers/ActionCreators';
import { useNavigate } from 'react-router-dom';

export const CreateGroupPage = () => {
  const [groupName, setGroupName] = useState('');
  const [groupMode, setGroupMode] = useState('');
  const [errors, setErrors] = useState('');
  const [isShowAlertSuccess, setIsShowAlertSuccess] = useState<boolean>(false);
  const [isShowAlertError, setIsShowAlertError] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { userGoogleProfile, isLoading } = useAppSelector((state) => state.storeReducer);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    // dispatch(storeSlice.actions.fetchingStart());
    const redirectFunc = () => {
      navigate('/profile');
    };

    if (!groupName) {
      setErrors('group name field cannot be empty');
      dispatch(storeSlice.actions.fetchingEnd());
      return;
    } else if (!groupMode) {
      setErrors('group mode field cannot be empty');
      dispatch(storeSlice.actions.fetchingEnd());
      return;
    }

    const newGroup: IGroup = {
      groupName: groupName,
      groupMode: groupMode,
      members: [] as IGroupMember[],
      administrators: [{ userName: userGoogleProfile.name, email: userGoogleProfile.email }],
      parties: [] as IParty[],
      isPremium: false,
    };
    await dispatch(createGroup(newGroup, setIsShowAlertSuccess, setIsShowAlertError, redirectFunc));
    setGroupMode('');
    setGroupName('');
    setErrors('');
    (document.getElementById('form__create-group')! as HTMLFormElement).reset();
    dispatch(storeSlice.actions.fetchingEnd());
  };

  const handleClose = () => {
    setIsShowAlertSuccess(false);
    setIsShowAlertError(false);
  };

  return (
    <div className="container create-group-page ">
      {isLoading && (
        <div className="darkened-display">
          <Preloader />
        </div>
      )}

      <Snackbar open={isShowAlertSuccess} autoHideDuration={4000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{
            width: '100%',
            backgroundColor: '#2E7D32',
          }}
        >
          Група успішно створена!
        </Alert>
      </Snackbar>

      <Snackbar open={isShowAlertError} autoHideDuration={4000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{
            width: '100%',
            backgroundColor: 'ff0000',
          }}
        >
          Група з такою назвою вже існує!
        </Alert>
      </Snackbar>

      <form className="form" id="form__create-group">
        <h2>Створити нову групу</h2>

        <div className="input__container">
          <TextField
            label="Назва групи"
            onChange={(e) => setGroupName(e.target.value)}
            size="small"
            value={groupName}
          />
        </div>

        <div className="input__container">
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Тип групи</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={groupMode}
              label="Тип групи"
              onChange={(e) => setGroupMode(e.target.value)}
            >
              <MenuItem value={'Duel'}>Duel</MenuItem>
              <MenuItem value={'Mass PvP'}>Mass PvP</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Button
          variant="contained"
          className="btn_registration"
          // type={'submit'}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Створити
        </Button>
      </form>
    </div>
  );
};
