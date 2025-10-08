import { configureStore } from '@reduxjs/toolkit';
import { api } from '@shared/api';
import { rootReducer } from './rootReducer';

export const store = configureStore({
	/** Sending reducers */
	reducer: rootReducer,
	/** Middlewares configuration */
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
