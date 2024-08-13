import {createAsyncThunk} from "@reduxjs/toolkit";
import {authAPI, FieldErrorType, LoginParamsType} from "../../api/todolists-api";
import {appActions} from "../Application/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {tasksActions} from "../TodolistsList/tasks-reducer";
import {todolistsAction} from "../TodolistsList/todolists-reducer";
import {setAppStatus} from "../CommonActions/ApplicationCommonActions";

export const loginTC = createAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType, {
    rejectValue: { errors: Array<string>, fieldsErrors?: FieldErrorType }
}>('auth/login',
    async (arg: LoginParamsType, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            const res = await authAPI.login(arg)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                return {isLoggedIn: true}
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)


                // @ts-ignore
                return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
            }
        } catch (err) {

            // @ts-ignore
            const error: AxiosError = err
            // @ts-ignore
            handleServerNetworkError(error, dispatch)
            return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
        }
    })
export const logoutTC = createAsyncThunk('auth/logout',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            const res = await authAPI.logout()
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                dispatch(tasksActions.clearTasks())
                dispatch(todolistsAction.clearTodolist())
                return {isLoggedIn: false}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            // @ts-ignore
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)