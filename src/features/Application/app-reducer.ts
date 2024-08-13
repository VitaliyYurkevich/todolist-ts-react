
import {authAPI} from '../../api/todolists-api'
import {setIsLoggedInAC} from '../Auth/auth-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError} from "../../utils/error-utils";
import {setAppError, setAppStatus} from "../CommonActions/ApplicationCommonActions";

export type AppInitialStateType = ReturnType<typeof slice.getInitialState>

export const initializeAppTC = createAsyncThunk<{ isInitialized: boolean }>('application/initializeApp', async (param, {
    dispatch,
    rejectWithValue
}) => {
    const res = await authAPI.me()
    try {
        if (res.data.resultCode === 0) {
           dispatch(setIsLoggedInAC(true))
            return {isInitialized: true}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'application',
    initialState: {
        status: 'idle',
        error: null,
        isInitialized: false
    } as InitialStateType,
    reducers: {
        /*setAppError: (state, action: PayloadAction<{ error: null }>) => {
            state.error = action.payload.error
        },
        setAppStatus: (state, action: PayloadAction<{ status: string }>) => {
            state.status = action.payload.status
        },*/
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeAppTC.fulfilled, (state, action: PayloadAction<{ isInitialized: boolean }>) => {
                state.isInitialized = action.payload.isInitialized
            })
            .addCase(setAppError, (state, action)=>{
                state.error = action.payload.error
            })
            .addCase(setAppStatus, (state, action)=> {
                state.status = action.payload.status
            })
    }
})

export const appReducer = slice.reducer

export const appActions = slice.actions

export const appThunk = {initializeAppTC}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}


