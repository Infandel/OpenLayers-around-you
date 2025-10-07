import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type Map from 'ol/Map';
import type VectorSource from 'ol/source/Vector';
import type Overlay from 'ol/Overlay';
import { MapControls } from '@features/mapControls';
import { useGetMarkersQuery, markersActions } from '@entities/marker';
import { RootState } from '@app/store';
import { closePopupHandler } from '../helpers/closePopupHandler';
import { useAddMarker } from '../hooks/useAddMarker';
import { useInitializeMap } from '../hooks/useInitializeMap';
import { useUpdateMarkers } from '../hooks/useUpdateMarkers';
import { useZoomToSelectedMarker } from '../hooks/useZoomToSelectedMarker';

export function MapWidget() {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<Map | null>(null);
	const vectorSourceRef = useRef<VectorSource | null>(null);
	const popupRef = useRef<HTMLDivElement>(null);
	const popupOverlayRef = useRef<Overlay | null>(null);
	const [isAddingMarker, setIsAddingMarker] = useState(false);
	const isAddingMarkerRef = useRef(false);

	const addMarker = useAddMarker({ isAddingMarkerRef, setIsAddingMarker });

	const dispatch = useDispatch();
	const markers = useSelector((state: RootState) => state.markers.markers);

	const { data: apiMarkers, isLoading } = useGetMarkersQuery();

	useEffect(() => {
		isAddingMarkerRef.current = isAddingMarker;
	}, [isAddingMarker]);

	// Load markers from API on mount
	useEffect(() => {
		if (apiMarkers && apiMarkers.length > 0) {
			dispatch(markersActions.loadMarkersFromApi(apiMarkers));
		}
	}, [apiMarkers, dispatch]);

	useInitializeMap({ mapRef, mapInstanceRef, vectorSourceRef, popupRef, popupOverlayRef, isAddingMarkerRef });

	useUpdateMarkers({ vectorSourceRef, mapInstanceRef, popupRef, popupOverlayRef });

	// Add new marker
	useEffect(() => {
		if (mapInstanceRef.current) {
			mapInstanceRef.current.on('click', addMarker);
		}
	}, [mapInstanceRef.current, markers]);

	useZoomToSelectedMarker({ mapInstanceRef });

	return (
		<div className='relative flex-1 h-full'>
			<div ref={mapRef} className='w-full h-full' />

			<MapControls isAddingMarker={isAddingMarker} onToggleAddMarker={() => setIsAddingMarker(!isAddingMarker)} />

			{isLoading && (
				<div className='absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg'>
					<p className='text-sm text-gray-600'>Loading markers...</p>
				</div>
			)}

			<div ref={popupRef} className='ol-popup'>
				<button onClick={() => closePopupHandler({ popupOverlayRef, dispatch })} className='ol-popup-closer'>
					×
				</button>
				<div>
					<h3 className='popup-name font-semibold text-lg mb-1'></h3>
					<p className='popup-description text-sm text-gray-600'></p>
				</div>
			</div>
		</div>
	);
}
