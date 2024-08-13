import {tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList';
import {ActionCreatorsMapObject, bindActionCreators, combineReducers} from '@reduxjs/toolkit'
import {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {appReducer} from '../features/Application/app-reducer'
import {authReducer} from '../features/Auth'
import {configureStore, UnknownAction} from "@reduxjs/toolkit";
import {useAppDispatch} from "../hooks/useAppDispatch";
import {useMemo} from "react";

const rootReducer = combineReducers({
	tasks: tasksReducer,
	todolists: todolistsReducer,
	app: appReducer,
	auth: authReducer
})

export const store = configureStore({reducer: rootReducer},)

export type AppRootStateType = ReturnType<typeof store.getState>


export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, UnknownAction>

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {

	const dispatch = useAppDispatch()

	const boundActions = useMemo(()=>{
		return bindActionCreators(actions, dispatch)
	},[])

	return boundActions
}

