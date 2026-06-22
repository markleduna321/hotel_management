import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bookingApi = createApi({
    reducerPath: 'bookingApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api', credentials: 'include' }),
    tagTypes: ['Availability', 'Reservation'],
    endpoints: (builder) => ({
        checkAvailability: builder.query({
            query: ({ checkIn, checkOut, guests }) =>
                `/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
            providesTags: ['Availability'],
        }),
        createReservation: builder.mutation({
            query: (body) => ({
                url: '/reservations',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Availability', 'Reservation'],
        }),
    }),
});

export const { useCheckAvailabilityQuery, useCreateReservationMutation } = bookingApi;
