import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Marker } from '../model/types';

// Mock API data
const mockMarkers: Marker[] = [
	{
		id: '1',
		name: 'Central Park',
		description: 'Beautiful urban park in the heart of the city',
		coordinates: [-73.9654, 40.7829],
	},
	{
		id: '2',
		name: 'Times Square',
		description: 'Famous commercial intersection and tourist destination',
		coordinates: [-73.9855, 40.758],
	},
	{
		id: '3',
		name: 'Brooklyn Bridge',
		description: 'Iconic suspension bridge connecting Manhattan and Brooklyn',
		coordinates: [-73.9969, 40.7061],
	},
];

export const markersApi = createApi({
	reducerPath: 'markersApi',
	baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
	endpoints: (builder) => ({
		getMarkers: builder.query<Marker[], void>({
			queryFn: async () => {
				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 500));
				return { data: mockMarkers };
			},
		}),
	}),
});

export const { useGetMarkersQuery } = markersApi;
