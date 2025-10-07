import type MapBrowserEvent from 'ol/MapBrowserEvent';
import { toLonLat } from 'ol/proj';
import { type MutableRefObject, type SetStateAction, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { type Marker, markersActions } from '@entities/marker';

interface IUseAddMarker {
	isAddingMarkerRef: MutableRefObject<boolean>;
	setIsAddingMarker: (value: SetStateAction<boolean>) => void;
}

export const useAddMarker = ({ isAddingMarkerRef, setIsAddingMarker }: IUseAddMarker) => {
	const dispatch = useDispatch();

	return useCallback((evt: MapBrowserEvent<any>) => {
		if (isAddingMarkerRef.current) {
			const coordinates = toLonLat(evt.coordinate) as [number, number];
			const newMarker: Marker = {
				id: Date.now().toString(),
				name: `New Marker`,
				description: 'Click to edit description',
				coordinates,
			};

			dispatch(markersActions.addMarker(newMarker));
			setIsAddingMarker(false);
			return;
		}
	}, []);
};
