import {TodolistType} from '../../api/todolists-api'
import {RequestStatusType} from '../Application/app-reducer'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolist, changeTodolistTitle, fetchTodolists, removeTodolist} from "./todolists-actions";


export const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id)
            if (todo) {
                todo.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id);
            if (todo) {
                todo.entityStatus = action.payload.entityStatus;
            }
        },
        clearTodolist: () => {
            return []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const todo = state.findIndex((todo) => todo.id === action.payload.id)
                if (todo > -1) {
                    state.splice(todo, 1)
                }
            })
            .addCase(addTodolist.fulfilled, (state, action)=>{
                const newTodolist: TodolistDomainType = {...action.payload.todolist, filter: 'all', entityStatus: 'idle'}
                state.unshift(newTodolist)
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const todo = state.find((todo) => todo.id === action.payload.id);
                if (todo) {
                    todo.title = action.payload.title;
                }
            })
    }
})
export const todolistsReducer = slice.reducer

export const todolistsAction = slice.actions

export const todolistsThunk = {fetchTodolistsTC: fetchTodolists, removeTodolistTC: removeTodolist, addTodolistTC: addTodolist, changeTodolistTitleTC: changeTodolistTitle}

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
