import React, { useEffect, useState } from 'react';
import './GroupPage.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { deleteGroup, getGroup } from '../../store/reducers/ActionCreators';
import { IGroup } from '../../types';
import BasicModal from '../../components/UI/BasicModal/BasicModal';
import Preloader from '../../components/UI/Preloader/Preloader';

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

  if (!groupState.followers) {
    return <Preloader />;
  }
  const admins = groupState.administrators.map((admin) => {
    return Object.values(admin);
  });

  return (
    <div className="container group-page">
      <div className="group-page__row">
        <h2>{groupState.groupName}</h2>
      </div>
      <div className="group-page__row">
        {groupState.members.length > 0 && (
          <button
            onClick={() => {
              navigate(`/group/${id}/create-party`);
            }}
          >
            Почати нову партію
          </button>
        )}

        <button
          onClick={() => {
            handleOpenModalMembers();
            // dispatch(getGroup(id!, setGroupState));
            // navigate(`/group/${id}/create-party`);
          }}
        >
          Додати нових учасників
        </button>

        {!groupState.administrators
          .map((admin) => {
            return Object.values(admin);
          })
          .flat()
          .includes(currentUser.userName) && (
          <div>
            {groupState.followers.includes(currentUser._id) ? (
              <button onClick={() => {}}>Відписатися</button>
            ) : (
              <button onClick={() => {}}>Підписатися</button>
            )}
          </div>
        )}
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
        <div className="group-page__dashboard-item">
          <h4>parties table under spoiler</h4>
          {groupState.parties.map((party, index) => {
            return (
              <div key={Date.now() + index}>
                {party.date} {party.gameName}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={async () => {
          await dispatch(deleteGroup(id!, currentUser));
          navigate('/profile');
        }}
      >
        delete group
      </button>

      <BasicModal
        handleOpenModal={handleOpenModalMembers}
        handleCloseModal={handleCloseModalMembers}
        openModal={openModalMembers}
        modalType="member"
        groupID={id!}
        setGroupState={setGroupState}
      />

      {/*<BasicModal*/}
      {/*  handleOpenModal={handleOpenModalParty}*/}
      {/*  handleCloseModal={handleCloseModalParty}*/}
      {/*  openModal={openModalParty}*/}
      {/*  modalType="party"*/}
      {/*  groupID={id!}*/}
      {/*/>*/}
    </div>
  );
};
