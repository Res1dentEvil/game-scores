import React, { ChangeEvent, useEffect, useState } from 'react';
import './DynamicForm.scss';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { IGroup, IGroupMember } from '../../types';
import { createParty, getGroup } from '../../store/reducers/ActionCreators';
import { useAppDispatch } from '../../hooks/redux';
import Preloader from '../UI/Preloader/Preloader';
import { formatDate } from '../../helpers/formatingDate';
import IconGames from '../../assets/img/games.svg';

export interface Field {
  name: string;
  point: string;
}
interface DynamicFormProps {
  groupState: IGroup;
}

export const DynamicForm = ({ groupState }: DynamicFormProps) => {
  const [groupMembers, setGroupMembers] = useState<IGroupMember[]>([]);
  const [members, setMembers] = useState<Field[]>([{ name: '', point: '' }]);
  const [gameName, setGameName] = useState('');
  const [gameTime, setGameTime] = useState('');
  const [gameDate, setGameDate] = useState(formatDate());
  const [error, setError] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (groupState.groupName) {
      setGroupMembers(groupState.members);
    }
  }, [groupState]);

  const handleAddField = () => {
    const newFields = [...members, { name: '', point: '' }];
    setMembers(newFields);
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    const { name, value } = event.target;
    const newFields = [...members];
    newFields[index][name as keyof Field] = value as string;
    setMembers(newFields);
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const validMembers = members.filter(
      (member) => member.name.length > 0 && member.point.length > 0
    );

    const uniqueNames = new Set();
    const duplicates: string[] = [];

    validMembers.forEach((member) => {
      if (!uniqueNames.has(member.name)) {
        uniqueNames.add(member.name);
      } else {
        duplicates.push(member.name);
      }
    });

    if (duplicates.length > 0) {
      setError(true);
      return;
    }

    const getWinners = () => {
      validMembers.sort(function (a, b) {
        return parseInt(b.point) - parseInt(a.point);
      });
      return validMembers.slice(0, 3);
    };

    if (!gameName || !gameTime || validMembers.length < 2) {
      setError(true);
      return;
    }

    const newParty = {
      date: gameDate,
      gameName: gameName,
      duration: gameTime,
      partyMembers: validMembers,
      winners: getWinners(),
      winDescription: '',
    };

    await dispatch(createParty(newParty, id!));
    setError(false);
    navigate(`/group/${id}`);
  };

  if (!groupMembers.length) {
    return <Preloader />;
  } else {
    return (
      <div className="create-party">
        <form className="form" id="form__create-party">
          <div className="form__default-fields">
            <div className="select__container">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Назва гри</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="name"
                  value={gameName}
                  size="small"
                  label="Назва гри"
                  onChange={(e) => {
                    setGameName(e.target.value);
                  }}
                >
                  {groupState.gamesList!.map((game, optionIndex) => {
                    return (
                      <MenuItem key={optionIndex} value={game.title}>
                        <div className="select-item">
                          <img
                            className="select-item__img"
                            src={game.image.length ? game.image : IconGames}
                            alt="game icon"
                          />
                          {game.title.slice(0, 20)}
                        </div>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>

            <TextField
              label="Тривалість гри, хв"
              type="number"
              name="time"
              size="small"
              value={gameTime}
              onChange={(e) => {
                setGameTime(e.target.value);
              }}
            />
            <TextField
              type="date"
              name="date"
              size="small"
              defaultValue={formatDate()}
              onChange={(e) => {
                setGameDate(e.target.value);
              }}
            />
          </div>
          <div className="form__dynamic-fields">
            {members.map((member, index) => (
              <div key={index}>
                <div className="input__container input__party-create">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">І&apos;мя учасника</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="name"
                      value={member.name}
                      size="small"
                      label="Ім'я учасника"
                      onChange={(event) =>
                        handleInputChange(
                          index,
                          event as React.ChangeEvent<{ name?: string; value: unknown }>
                        )
                      }
                    >
                      {groupMembers.map((member, optionIndex) => {
                        return (
                          <MenuItem key={optionIndex} value={member.memberName}>
                            {member.memberName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Кількість балів"
                    type="number"
                    name="point"
                    size="small"
                    value={member.point}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </div>
              </div>
            ))}
          </div>
          {error && <h4>Потрібно заповнити всі поля</h4>}
        </form>
        <button id="btn__add-field" type="button" onClick={handleAddField}>
          Додати поле
        </button>
        <button onClick={handleSubmit}>Створити партію</button>
      </div>
    );
  }
};
