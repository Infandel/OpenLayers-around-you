import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature, MapBrowserEvent } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon } from 'ol/style';
import Overlay from 'ol/Overlay';
import { MapControls, markersActions } from '@/features/markers';
import { Marker, useGetMarkersQuery } from '@entities/marker';
import { RootState } from '@app/store';

export function MapWidget() {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<Map | null>(null);
	const vectorSourceRef = useRef<VectorSource | null>(null);
	const popupRef = useRef<HTMLDivElement>(null);
	const popupOverlayRef = useRef<Overlay | null>(null);
	const [isAddingMarker, setIsAddingMarker] = useState(false);
	const isAddingMarkerRef = useRef(false);

	const dispatch = useDispatch();
	const markers = useSelector((state: RootState) => state.markers.markers);
	const selectedMarkerId = useSelector((state: RootState) => state.markers.selectedMarkerId);

	const { data: apiMarkers, isLoading } = useGetMarkersQuery();

	useEffect(() => {
		isAddingMarkerRef.current = isAddingMarker;
	}, [isAddingMarker]);

	console.log(markers.length);

	const mapClickHandler = useCallback(
		() => (evt: MapBrowserEvent<any>, map: Map, popupOverlay: Overlay) => {
			if (isAddingMarkerRef.current) {
				const coordinates = toLonLat(evt.coordinate) as [number, number];
				const newMarker: Marker = {
					id: Date.now().toString(),
					name: `Marker ${markers.length + 1}`,
					description: 'Click to edit description',
					coordinates,
				};

				dispatch(markersActions.addMarker(newMarker));
				setIsAddingMarker(false);
				return;
			}

			const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);

			if (feature) {
				const markerId = feature.get('markerId');
				const marker = markers.find((m) => m.id === markerId);

				if (marker) {
					dispatch(markersActions.setSelectedMarker(markerId));
					const coordinate = fromLonLat(marker.coordinates);

					popupRef.current!.querySelector('.popup-name')!.textContent = marker.name;
					popupRef.current!.querySelector('.popup-description')!.textContent = marker.description;

					popupOverlay.setPosition(coordinate);
				}
			} else {
				popupOverlay.setPosition(undefined);
				dispatch(markersActions.clearSelectedMarker());
			}
		},
		[isAddingMarker]
	);

	// Load markers from API on mount
	useEffect(() => {
		if (apiMarkers && apiMarkers.length > 0) {
			dispatch(markersActions.loadMarkersFromApi(apiMarkers));
		}
	}, [apiMarkers, dispatch]);

	// Initialize map
	useEffect(() => {
		if (!mapRef.current || !popupRef.current) return;

		const vectorSource = new VectorSource();
		vectorSourceRef.current = vectorSource;

		const vectorLayer = new VectorLayer({
			source: vectorSource,
			style: new Style({
				image: new Icon({
					anchor: [0.5, 1],
					src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%232563eb"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
					scale: 1.2,
				}),
			}),
		});

		const map = new Map({
			target: mapRef.current,
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
				vectorLayer,
			],
			view: new View({
				center: fromLonLat([-73.9654, 40.7829]),
				zoom: 12,
			}),
		});

		// Setup popup overlay
		const popupOverlay = new Overlay({
			element: popupRef.current,
			autoPan: {
				animation: {
					duration: 250,
				},
			},
			positioning: 'center-center',
		});

		map.addOverlay(popupOverlay);
		popupOverlayRef.current = popupOverlay;

		// Handle marker clicks
		map.on('click', (evt) => mapClickHandler()(evt, map, popupOverlay));

		// Change cursor on hover
		map.on('pointermove', (evt) => {
			const hit = map.hasFeatureAtPixel(evt.pixel);
			map.getTargetElement().style.cursor = hit ? 'pointer' : isAddingMarkerRef.current ? 'crosshair' : '';
		});

		mapInstanceRef.current = map;

		return () => {
			map.setTarget(undefined);
		};
	}, []);

	// Update markers on map
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
	}, [markers]);

	// Zoom to selected marker
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

	const handleClosePopup = () => {
		if (popupOverlayRef.current) {
			popupOverlayRef.current.setPosition(undefined);
		}
		dispatch(markersActions.clearSelectedMarker());
	};

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
				<button onClick={handleClosePopup} className='ol-popup-closer'>
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
