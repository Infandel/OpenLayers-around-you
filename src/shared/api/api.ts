import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/** Базовые настройки api приложения */
export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: '/api',
	}),
	endpoints: () => ({}),
});
