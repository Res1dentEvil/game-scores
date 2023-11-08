import React, { useEffect, useState } from 'react';
import './AllGroupsPage.scss';
import { IGroup } from '../../types';
import { useAppDispatch } from '../../hooks/redux';
import { getAllGroups } from '../../store/reducers/ActionCreators';
import { GroupIntro } from '../../components/GroupIntro/GroupIntro';
import { TextField } from '@mui/material';

export const AllGroupsPage = () => {
  const [allGroups, setAllGroups] = useState<IGroup[]>([]);
  const [searchGroupName, setSearchGroupName] = useState('');
  const [filteredGroups, setFilteredGroups] = useState<IGroup[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllGroups(setAllGroups, setFilteredGroups));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value.toLowerCase();
    setSearchGroupName(searchText);

    const filteredGroups = allGroups.filter((group) =>
      group.groupName.toLowerCase().includes(searchText)
    );
    setFilteredGroups(filteredGroups);
  };

  return (
    <div className="all-groups">
      <div className="all-groups__search">
        <TextField
          label="Пошук групи"
          type="text"
          name="group"
          value={searchGroupName}
          onChange={handleSearch}
          fullWidth
        />
      </div>
      <div className="all-groups-list">
        {filteredGroups.map((group) => {
          return <GroupIntro key={group._id} group={group} />;
        })}
      </div>
    </div>
  );
};
