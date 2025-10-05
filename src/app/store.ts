import { markersReducer } from '@/features/markers';
import { configureStore } from '@reduxjs/toolkit';
import { markersApi } from '@entities/marker/api/markersApi';

export const store = configureStore({
	reducer: {
		markers: markersReducer,
		[markersApi.reducerPath]: markersApi.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(markersApi.middleware),
});
