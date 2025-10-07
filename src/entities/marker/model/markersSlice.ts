import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Marker } from './types';

interface MarkersState {
	markers: Marker[];
	selectedMarkerId: string | null;
}

const initialState: MarkersState = {
	markers: [],
	selectedMarkerId: null,
};

export const { actions: markersActions, reducer: markersReducer } = createSlice({
	name: 'markers',
	initialState,
	reducers: {
		addMarker: (state, action: PayloadAction<Marker>) => {
			state.markers.push(action.payload);
		},
		removeMarker: (state, action: PayloadAction<string>) => {
			state.markers = state.markers.filter((m) => m.id !== action.payload);
		},
		setSelectedMarker: (state, action: PayloadAction<string | null>) => {
			state.selectedMarkerId = action.payload;
		},
		clearSelectedMarker: (state) => {
			state.selectedMarkerId = null;
		},
		loadMarkersFromApi: (state, action: PayloadAction<Marker[]>) => {
			state.markers = action.payload;
		},
	},
});
