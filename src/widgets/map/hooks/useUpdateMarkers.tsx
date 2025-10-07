import { RootState } from '@app/store';
import Feature from 'ol/Feature';
import { type Geometry, Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import type VectorSource from 'ol/source/Vector';
import { type MutableRefObject, type RefObject, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type Map from 'ol/Map';
import { markersActions } from '@entities/marker';
import type Overlay from 'ol/Overlay';

interface IUseUpdateMarkers {
	vectorSourceRef: MutableRefObject<VectorSource<Feature<Geometry>> | null>;
	mapInstanceRef: MutableRefObject<Map | null>;
	popupRef: RefObject<HTMLDivElement>;
	popupOverlayRef: MutableRefObject<Overlay | null>;
}

export const useUpdateMarkers = ({ vectorSourceRef, mapInstanceRef, popupRef, popupOverlayRef }: IUseUpdateMarkers) => {
	const dispatch = useDispatch();
	const markers = useSelector((state: RootState) => state.markers.markers);

	useEffect(() => {
		if (!vectorSourceRef.current) return;

		vectorSourceRef.current.clear();

		markers.forEach((marker) => {
			const feature = new Feature({
				geometry: new Point(fromLonLat(marker.coordinates)),
			});
			feature.set('markerId', marker.id);
			vectorSourceRef.current!.addFeature(feature);
		});

		// Display popup data on marker Click
		mapInstanceRef.current!.on('click', (evt) => {
			const feature = mapInstanceRef.current!.forEachFeatureAtPixel(evt.pixel, (feature) => feature);

			if (feature) {
				const markerId = feature.get('markerId');
				const marker = markers.find((m) => m.id === markerId);

				if (marker) {
					dispatch(markersActions.setSelectedMarker(markerId));
					const coordinate = fromLonLat(marker.coordinates);

					popupRef.current!.querySelector('.popup-name')!.textContent = marker.name;
					popupRef.current!.querySelector('.popup-description')!.textContent = marker.description;

					popupOverlayRef.current!.setPosition(coordinate);
				}
			} else {
				popupOverlayRef.current!.setPosition(undefined);
				dispatch(markersActions.clearSelectedMarker());
			}
		});
	}, [markers]);
};
