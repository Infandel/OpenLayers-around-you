import { configureStore } from '@reduxjs/toolkit';
import { markersReducer, markersApi } from '@entities/marker';

export const store = configureStore({
	reducer: {
		markers: markersReducer,
		[markersApi.reducerPath]: markersApi.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(markersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
