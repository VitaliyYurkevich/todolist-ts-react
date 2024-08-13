import {createAppAsyncThunk} from "../../utils/create-app-async-thunk";
import {todolistsAPI, TodolistType, UpdateTodolistTitleArgType} from "../../api/todolists-api";
import {appActions} from "../Application/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {todolistsAction} from "./todolists-reducer";
import {setAppStatus} from "../CommonActions/ApplicationCommonActions";

export const fetchTodolists = createAsyncThunk('todolists/fetchTodolists',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(setAppStatus({status: 'loading'}))
            const res = await todolistsAPI.getTodolists()
            dispatch(setAppStatus({status: 'succeeded'}))
            return {todolists: res.data}
        } catch (e) {
            // @ts-ignore
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })
export const removeTodolist = createAppAsyncThunk<{
    id: string
}, string>("todo/removeTodolist", async (id, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI;
    try {
        dispatch(setAppStatus({status: "loading"}));
        dispatch(todolistsAction.changeTodolistEntityStatus({id, entityStatus: "loading"}));
        const res = await todolistsAPI.deleteTodolist(id);
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: "succeeded"}));
            return {id};
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
    }
});
export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
    "todo/addTodolist",
    async (title, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        try {
            dispatch(setAppStatus({status: "loading"}));
            const res = await todolistsAPI.createTodolist(title);
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: "succeeded"}));
                return {todolist: res.data.data.item};
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    },
);
export const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
    "todo/changeTodolistTitle",
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI;
        try {
            dispatch(setAppStatus({status: "loading"}));
            const res = await todolistsAPI.updateTodolist(arg.id, arg.title);
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: "succeeded"}));
                return arg;
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    },
);