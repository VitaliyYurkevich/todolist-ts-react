import {createSlice} from "@reduxjs/toolkit";
import {initializeAppTC, loginTC, logoutTC} from "./auth-actions";


export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        /*setIsLoggedIn: (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }*/
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginTC.fulfilled, (state, action)=>{
                    state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logoutTC.fulfilled, (state, action)=>{
                    state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(initializeAppTC.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            })
    }
})

export const authReducer = slice.reducer

export const authActions = slice.actions

export const authThunk = {logoutTC, loginTC, initializeAppTC}

export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

