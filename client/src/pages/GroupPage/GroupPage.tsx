import React, { useEffect, useState } from 'react';
import './GroupPage.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { deleteGroup, getGroup } from '../../store/reducers/ActionCreators';
import { IGroup } from '../../types';
import { Button } from '../../components/UI/Button/Button';
import { Box, Modal } from '@mui/material';
import BasicModal from '../../components/UI/BasicModal/BasicModal';

export const GroupPage = () => {
  const [groupState, setGroupState] = useState({} as IGroup);

  const [openModalMembers, setOpenModalMembers] = React.useState(false);
  const [openModalParty, setOpenModalParty] = React.useState(false);

  const handleOpenModalMembers = () => setOpenModalMembers(true);
  const handleCloseModalMembers = () => setOpenModalMembers(false);

  const handleOpenModalParty = () => setOpenModalParty(true);
  const handleCloseModalParty = () => setOpenModalParty(false);

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentUser } = useAppSelector((state) => state.storeReducer);

  useEffect(() => {
    if (id) {
      dispatch(getGroup(id, setGroupState));
    }
  }, []);

  return (
    <div className="container group-page">
      <div className="group-page__row">
        <h2>{groupState.groupName}</h2>
      </div>
      <div className="group-page__row">
        <button
          onClick={() => {
            handleOpenModalParty();
          }}
        >
          Почати нову партію
        </button>
        <button
          onClick={() => {
            handleOpenModalMembers();
          }}
        >
          Додати нових учасників
        </button>
      </div>

      <div className="group-page__row">
        <div className="group-page__row-btn-group">
          <button>All times</button>
          <button>2021</button>
          <button>2022</button>
          <button>2023</button>
        </div>
      </div>
      <div className="group-page__row">
        <div className="group-page__dashboard-item">win % rate</div>
        <div className="group-page__dashboard-item">win point rate</div>
      </div>
      <div className="group-page__row">
        <div className="group-page__dashboard-item">diagram games %</div>
      </div>
      <div className="group-page__row">
        <div className="group-page__dashboard-item">members table</div>
      </div>
      <div className="group-page__row">
        <div className="group-page__dashboard-item">parties table under spoiler</div>
      </div>

      {/*<button*/}
      {/*  onClick={async () => {*/}
      {/*    await dispatch(deleteGroup(id!, currentUser));*/}
      {/*    navigate('/profile');*/}
      {/*  }}*/}
      {/*>*/}
      {/*  delete group*/}
      {/*</button>*/}
      <BasicModal
        handleOpenModal={handleOpenModalMembers}
        handleCloseModal={handleCloseModalMembers}
        openModal={openModalMembers}
        modalType="member"
        groupID={id!}
      />

      <BasicModal
        handleOpenModal={handleOpenModalParty}
        handleCloseModal={handleCloseModalParty}
        openModal={openModalParty}
        modalType="party"
        groupID={id!}
      />
    </div>
  );
};
