import { Marker } from '@entities/marker';

export interface EditingMarkerState extends Omit<Marker, 'coordinates'> {}
