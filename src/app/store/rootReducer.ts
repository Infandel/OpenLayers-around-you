import { combineReducers } from '@reduxjs/toolkit';
import { api } from '@shared/api';
import { markersReducer } from '@entities/marker';

export const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	markers: markersReducer,
});
