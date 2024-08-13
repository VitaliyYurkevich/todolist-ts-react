import {TaskPriorities, TaskStatuses, TaskType} from '../../api/todolists-api'
import {createSlice} from "@reduxjs/toolkit";
import {todolistsThunk} from "./todolists-reducer";
import {addTask, fetchTasks, removeTask, updateTask} from "./tasks-actions";


const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        clearTasks: () => {
            return {}
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(todolistsThunk.addTodolistTC.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsThunk.removeTodolistTC.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(fetchTasks.rejected, (state, action) => {

            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift(action.payload)
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) tasks.splice(index, 1)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            })
            .addCase(todolistsThunk.fetchTodolistsTC.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = []
                })
            })

    }
})


export const tasksReducer = slice.reducer

export const tasksActions = slice.actions

export const tasksThunks = {fetchTasks, addTaskTC: addTask, updateTaskTC: updateTask}


// types
export type UpdateDomainTaskModelType = {
    title?: string;
    description?: string;
    status?: TaskStatuses;
    priority?: TaskPriorities;
    startDate?: string;
    deadline?: string;
};
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
