import * as tasksActions from './tasks-actions'
import * as todolistsAsyncActions from './todolists-actions'
import {slice, todolistsReducer} from './todolists-reducer'
import {tasksReducer} from "./tasks-reducer";


const todolistsActions = {
    ...todolistsAsyncActions,
    ...slice.actions
}


export {
    tasksActions,
    todolistsActions,
    todolistsReducer
}
