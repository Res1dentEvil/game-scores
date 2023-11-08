import React, { useEffect, useState } from 'react';
import './GroupPage.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  deleteGroup,
  getCurrentUser,
  getGroup,
  subscribeGroup,
  unSubscribeGroup,
} from '../../store/reducers/ActionCreators';
import { IGroup } from '../../types';
import BasicModal from '../../components/UI/BasicModal/BasicModal';
import Preloader from '../../components/UI/Preloader/Preloader';
import { PartiesTable } from '../../components/PartiesTable/PartiesTable';
import { MembersTable } from '../../components/MembersTable/MembersTable';
import { tableData } from '../../helpers/getMemberTableData';
import { getAvatar } from '../../helpers/getAvatar';
import Player from '../../assets/img/players4.svg';
import Cup from '../../assets/img/wincup.png';
import { GamesChartDiagram } from '../../components/GamesChart/GamesChartDiagram';
import { AdditionButtonsPanel } from '../../components/AdditionButtonsPanel/AdditionButtonsPanel';
import { storeSlice } from '../../store/reducers/StoreSlice';

interface MemberData {
  playedGamesNames: string[];
  gamesWon: string[];
  points: number;
  winRate: number;
}

export const GroupPage = () => {
  const [groupState, setGroupState] = useState({} as IGroup);
  const [sortedData, setSortedData] = useState<Record<string, MemberData>>({});
  const [isAdmin, setIsAdmin] = useState(false);

  const [openModalMembers, setOpenModalMembers] = React.useState(false);
  const [openModalGame, setOpenModalGame] = React.useState(false);

  const { currentUser } = useAppSelector((state) => state.storeReducer);
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleOpenModalMembers = () => setOpenModalMembers(true);
  const handleCloseModalMembers = () => setOpenModalMembers(false);

  const handleOpenModalGame = () => setOpenModalGame(true);
  const handleCloseModalGame = () => setOpenModalGame(false);

  const handleUnSubscribeGroup = async () => {
    await dispatch(unSubscribeGroup(groupState._id!, currentUser._id, setGroupState));
    await dispatch(getGroup(groupState._id!, setGroupState));
    await dispatch(getCurrentUser(currentUser.email));
  };

  const handleSubscribeGroup = async () => {
    await dispatch(subscribeGroup(groupState._id!, currentUser._id, setGroupState));
    await dispatch(getGroup(groupState._id!, setGroupState));
    await dispatch(getCurrentUser(currentUser.email));
  };

  useEffect(() => {
    if (id) {
      dispatch(getGroup(id, setGroupState));
    }
  }, []);

  useEffect(() => {
    if (groupState.gamesList) {
      tableData(groupState, setSortedData);
    }
    if (groupState.administrators) {
      setIsAdmin(
        groupState.administrators
          .map((admin) => {
            return Object.values(admin);
          })
          .flat()
          .includes(currentUser.userName)
      );
    }
  }, [groupState.gamesList]);

  return (
    <div className="container group-page">
      {groupState.groupName && <h2>{groupState.groupName}</h2>}
      {!groupState.followers || !Object.keys(sortedData)[0] ? (
        <AdditionButtonsPanel
          handleOpenModalMembers={handleOpenModalMembers}
          handleOpenModalGame={handleOpenModalGame}
          isAdmin={isAdmin}
        />
      ) : (
        <div className="group-page__container">
          {groupState.administrators
            .map((admin) => {
              return Object.values(admin);
            })
            .flat()
            .includes(currentUser.userName) && (
            <div className="group-page__row">
              {groupState.members.length > 0 && groupState.gamesList!.length > 0 && (
                <button
                  onClick={() => {
                    navigate(`/group/${id}/create-party`);
                  }}
                >
                  Почати нову партію
                </button>
              )}

              <AdditionButtonsPanel
                handleOpenModalMembers={handleOpenModalMembers}
                handleOpenModalGame={handleOpenModalGame}
                isAdmin={isAdmin}
              />
            </div>
          )}

          {!groupState.administrators
            .map((admin) => {
              return Object.values(admin);
            })
            .flat()
            .includes(currentUser.userName) && (
            <div>
              {groupState.followers.includes(currentUser._id) ? (
                <button onClick={handleUnSubscribeGroup}>Відписатися</button>
              ) : (
                <button onClick={handleSubscribeGroup}>Підписатися</button>
              )}
            </div>
          )}

          <div className="group-page__row">
            <div className="group-page__row-btn-group">
              <button>All times</button>
              <button>2021</button>
              <button>2022</button>
              <button>2023</button>
            </div>
          </div>
          <div className="group-page__row">
            <div className="group-page__dashboard-item winner-dashboard-item">
              <div>
                <img
                  src={
                    getAvatar(Object.keys(sortedData)[0], groupState).length
                      ? getAvatar(Object.keys(sortedData)[0], groupState)
                      : Player
                  }
                  alt=""
                  className="member-avatar"
                  width={'60px'}
                ></img>
                <h3>Вітаємо, {Object.keys(sortedData)[0]}!</h3>
                <div className="dashboard-item__winner-description">Найвищий показник перемог</div>
                <div className="dashboard-item__win-rate">
                  {sortedData[Object.keys(sortedData)[0]].winRate.toFixed(1)}%
                </div>
              </div>

              <img className="dashboard-item__cup" src={Cup} alt="winner cup" />
            </div>

            {groupState.groupMode === 'Duel' ? (
              <div className="group-page__dashboard-item diagram-dashboard-item">
                <GamesChartDiagram groupState={groupState} />
              </div>
            ) : (
              <div className="group-page__dashboard-item">win point rate</div>
            )}
          </div>
          {groupState.groupMode === 'Mass PvP' && (
            <div className="group-page__row">
              <div className="group-page__dashboard-item">
                <GamesChartDiagram groupState={groupState} />
              </div>
            </div>
          )}

          <div className="group-page__row">
            <div className="group-page__dashboard-item">
              <MembersTable sortedData={sortedData} groupState={groupState} />
            </div>
          </div>
          <div className="group-page__row">
            <div className="group-page__dashboard-item">
              <PartiesTable groupState={groupState} />
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
        </div>
      )}
      <BasicModal
        handleOpenModal={handleOpenModalMembers}
        handleCloseModal={handleCloseModalMembers}
        openModal={openModalMembers}
        modalType="member"
        groupID={id!}
        setGroupState={setGroupState}
      />

      <BasicModal
        handleOpenModal={handleOpenModalGame}
        handleCloseModal={handleCloseModalGame}
        openModal={openModalGame}
        modalType="game"
        groupID={id!}
        setGroupState={setGroupState}
      />
    </div>
  );
};
