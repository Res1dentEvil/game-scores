import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import './ProfilePage.scss';
import { Button } from '../../components/UI/Button/Button';
import Preloader from '../../components/UI/Preloader/Preloader';
import { getProfileGroups } from '../../store/reducers/ActionCreators';
import { IGroup } from '../../types';
import { GroupIntro } from '../../components/GroupIntro/GroupIntro';
import BorderCircle from '../../assets/img/circle.png';

const ProfilePage = () => {
  const [profileGroups, setProfileGroups] = useState<IGroup[]>([]);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  const { userGoogleProfile, isLoading, currentUser } = useAppSelector(
    (state) => state.storeReducer
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentUser.groups) {
      dispatch(getProfileGroups(currentUser.groups, setProfileGroups, setLoadingProfile));
    }
  }, [currentUser]);
  return (
    <div className="container profile-page ">
      {isLoading ? (
        <Preloader />
      ) : (
        <div className="profile-page__container">
          <div className="profile-page__img-border">
            <img className="profile-page__img" src={userGoogleProfile.picture} alt="profile-img" />
          </div>

          {/*<img className="profile-page__img" src={userGoogleProfile.picture} alt="profile-img" />*/}
          <h2 className="profile-page__h2">{userGoogleProfile.name}</h2>
          <div>
            {loadingProfile ? (
              <></>
            ) : (
              <>
                {profileGroups.length > 0 ? (
                  <div className="profile-page__group-list">
                    {profileGroups.map((group) => {
                      if (group) {
                        return <GroupIntro key={group._id} group={group} />;
                      }
                    })}
                  </div>
                ) : (
                  <div>
                    <p>Ви не стежите за жодною групою</p>
                    <div className="profile-page__btn-group">
                      <Button value={'Створити власну групу'} navigateRoute={'/create-group'} />
                      <Button value={'Пошук з існуючих'} navigateRoute={'/groups'} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
