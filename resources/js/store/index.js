import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import bookingReducer from '../features/booking/bookingSlice';
import { bookingApi } from '../features/booking/bookingApi';

// Base RTK Query API - extend this from `features/*` later.
export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: '/api', credentials: 'include' }),
	tagTypes: ['User'],
	endpoints: (builder) => ({
		getUser: builder.query({
			query: () => '/user',
			providesTags: ['User'],
		}),
	}),
});

export const { useGetUserQuery } = api;

const store = configureStore({
	reducer: {
		[api.reducerPath]: api.reducer,
		[bookingApi.reducerPath]: bookingApi.reducer,
		booking: bookingReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(api.middleware)
			.concat(bookingApi.middleware),
});

setupListeners(store.dispatch);

export default store;
