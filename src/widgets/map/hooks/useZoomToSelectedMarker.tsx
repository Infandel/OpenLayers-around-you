import { type RootState } from '@app/store';
import { fromLonLat } from 'ol/proj';
import { type MutableRefObject, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type Map from 'ol/Map';

interface IUseZoomToSelectedMarker {
	mapInstanceRef: MutableRefObject<Map | null>;
}

export const useZoomToSelectedMarker = ({ mapInstanceRef }: IUseZoomToSelectedMarker) => {
	const selectedMarkerId = useSelector((state: RootState) => state.markers.selectedMarkerId);
	const markers = useSelector((state: RootState) => state.markers.markers);

	useEffect(() => {
		if (selectedMarkerId && mapInstanceRef.current) {
			const marker = markers.find((m) => m.id === selectedMarkerId);
			if (marker) {
				mapInstanceRef.current.getView().animate({
					center: fromLonLat(marker.coordinates),
					zoom: 15,
					duration: 500,
				});
			}
		}
	}, [selectedMarkerId, markers]);
};
