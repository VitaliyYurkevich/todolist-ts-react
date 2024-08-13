import {createAsyncThunk} from "@reduxjs/toolkit";
import {TaskType, todolistsAPI, UpdateTaskArgType, UpdateTaskModelType} from "../../api/todolists-api";
import {appActions} from "../Application/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAppAsyncThunk} from "../../utils/create-app-async-thunk";
import {setAppError, setAppStatus} from "../CommonActions/ApplicationCommonActions";

export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>('tasks/fetchTasks',
    async (todolistId, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(setAppStatus({status: 'loading'}))
            const res = await todolistsAPI.getTasks(todolistId)
            const tasks = res.data.items
            dispatch(setAppStatus({status: 'succeeded'}))
            return {tasks, todolistId}
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })
export const addTask = createAsyncThunk('tasks/addTask',
    async (arg: { title: string, todolistId: string }, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(setAppStatus({status: 'loading'}))
            const res = await todolistsAPI.createTask(arg.todolistId, arg.title)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                return res.data.data.item
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            // @ts-ignore
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })
export const removeTask = createAsyncThunk<{ taskId: string, todolistId: string }, { taskId: string, todolistId: string } >('tasks/removeTask',
    async (arg: { taskId: string, todolistId: string }, {rejectWithValue}) => {
        try {
            const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId)
            return arg
        } catch (e) {
            return rejectWithValue(null)
        }
    })
export const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>
('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const state = getState()
        const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
        if (!task) {


            dispatch(setAppError({error: 'Task not found'}))
            return rejectWithValue(null)
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...arg.domainModel
        }

        const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}))
            return arg
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})