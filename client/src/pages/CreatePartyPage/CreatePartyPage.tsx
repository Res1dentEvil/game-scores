import React, { useEffect, useState } from 'react';
import './CreatePartyPage.scss';
import { DynamicForm } from '../../components/DynamicForm/DynamicForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { IGroup } from '../../types';
import { getGroup } from '../../store/reducers/ActionCreators';
import { DynamicFormDuel } from '../../components/DynamicFormDuel/DynamicFormDuel';

export const CreatePartyPage = () => {
  const [groupState, setGroupState] = useState({} as IGroup);

  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getGroup(id, setGroupState));
    }
  }, []);

  return (
    <div className=" create-party">
      {groupState.groupMode === 'Duel' ? (
        <DynamicFormDuel groupState={groupState} />
      ) : (
        <DynamicForm groupState={groupState} />
      )}
    </div>
  );
};
