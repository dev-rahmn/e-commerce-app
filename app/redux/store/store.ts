 // store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from '../reducers/rootReducers';


// Persist configuration: only persist the auth slice.
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
   whitelist: ['auth','address'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable checks for redux-persist actions.
      serializableCheck: false,
    }),
});

// Create the persistor which will be used in PersistGate.
export const persistor = persistStore(store);

// Export types for usage with TypeScript (optional)
export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

