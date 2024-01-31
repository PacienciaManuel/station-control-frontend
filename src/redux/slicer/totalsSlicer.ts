import type { RootState } from '../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    totalCrimes: 0,
    totalSuspects: 0,
    totalEmployees: 0,
    totalApplicants: 0,
    totalOccurrences: 0,
    totalNotifications: 0,
}

export const totalsSlice = createSlice({
    name: 'totals',
    initialState,
    reducers: {
        changeTotalCrimes: (state, { payload }: PayloadAction<number>) => {
            return {...state, totalCrimes: payload};
        },

        changeTotalSuspects: (state, { payload }: PayloadAction<number>) => {
            return {...state, totalSuspects: payload};
        },

        changeTotalEmployees: (state, { payload }: PayloadAction<number>) => {
            return {...state, totalEmployees: payload};
        },

        changeTotalApplicants: (state, { payload }: PayloadAction<number>) => {
            return {...state, totalApplicants: payload};
        },

        changeTotalOccurrences: (state, { payload }: PayloadAction<number>) => {
            return {...state, totalOccurrences: payload};
        },

        changeTotalNotifications: (state, { payload }: PayloadAction<number>) => {
            return {...state, totalNotifications: payload};
        },
    }
})

export const { 
    changeTotalCrimes, changeTotalSuspects, 
    changeTotalEmployees, changeTotalApplicants,
    changeTotalOccurrences, changeTotalNotifications
} = totalsSlice.actions;
export const selectTatals = (state: RootState) => state.totals;
export const selectTatalCrimes = (state: RootState) => state.totals.totalCrimes;
export const selectTatalSuspects = (state: RootState) => state.totals.totalSuspects;
export const selectTatalEmployees = (state: RootState) => state.totals.totalEmployees;
export const selectTatalApplicants = (state: RootState) => state.totals.totalApplicants;
export const selectTatalOccurrences = (state: RootState) => state.totals.totalOccurrences;
export const selectTatalNotifications = (state: RootState) => state.totals.totalNotifications;
export default totalsSlice.reducer