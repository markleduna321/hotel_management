import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedRoomIndex: 0,
    checkIn: null,      // ISO date string e.g. "2026-06-25"
    checkOut: null,     // ISO date string
    guestCount: 2,
    isDetailPanelOpen: false,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setSelectedRoom(state, action) {
            state.selectedRoomIndex = action.payload;
        },
        setCheckIn(state, action) {
            state.checkIn = action.payload;
        },
        setCheckOut(state, action) {
            state.checkOut = action.payload;
        },
        setGuestCount(state, action) {
            state.guestCount = action.payload;
        },
        openDetailPanel(state) {
            state.isDetailPanelOpen = true;
        },
        closeDetailPanel(state) {
            state.isDetailPanelOpen = false;
        },
    },
});

export const {
    setSelectedRoom,
    setCheckIn,
    setCheckOut,
    setGuestCount,
    openDetailPanel,
    closeDetailPanel,
} = bookingSlice.actions;

export default bookingSlice.reducer;
