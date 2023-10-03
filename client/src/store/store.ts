import { combineReducers, configureStore } from '@reduxjs/toolkit';

import storeReducer from './reducers/StoreSlice';

const rootReducer = combineReducers({
  storeReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
