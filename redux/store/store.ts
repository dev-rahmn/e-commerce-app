import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import rootReducer from '../reducers/rootReducer';

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production', // Enables Redux DevTools only in development
  });

export default store;

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>