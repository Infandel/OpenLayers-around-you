import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import View from 'ol/View';
import Map from 'ol/Map';
import { type MutableRefObject, type RefObject, useEffect } from 'react';
import type Feature from 'ol/Feature';
import type { Geometry } from 'ol/geom';

interface IUseInitializeMap {
	mapRef: RefObject<HTMLDivElement>;
	mapInstanceRef: MutableRefObject<Map | null>;
	vectorSourceRef: MutableRefObject<VectorSource<Feature<Geometry>> | null>;
	popupRef: RefObject<HTMLDivElement>;
	popupOverlayRef: MutableRefObject<Overlay | null>;
	isAddingMarkerRef: MutableRefObject<boolean>;
}

export const useInitializeMap = ({
	mapRef,
	mapInstanceRef,
	vectorSourceRef,
	popupRef,
	popupOverlayRef,
	isAddingMarkerRef,
}: IUseInitializeMap) => {
	useEffect(() => {
		if (!mapRef.current || !popupRef.current) return;

		const vectorSource = new VectorSource();
		vectorSourceRef.current = vectorSource;

		const vectorLayer = new VectorLayer({
			source: vectorSource,
			style: new Style({
				image: new Icon({
					anchor: [0.5, 0.9],
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

		// Change cursor on hover
		map.on('pointermove', (evt) => {
			const hit = map.hasFeatureAtPixel(evt.pixel);
			map.getTargetElement().style.cursor = hit ? 'pointer' : isAddingMarkerRef.current ? 'crosshair' : '';
		});

		mapInstanceRef.current = map;

		// Clean map on Unmount
		return () => {
			map.setTarget(undefined);
		};
	}, []);
};
