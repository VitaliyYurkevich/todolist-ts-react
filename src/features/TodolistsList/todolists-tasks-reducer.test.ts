import {TodolistDomainType, todolistsAction, todolistsReducer, todolistsThunk} from './todolists-reducer'
import {tasksReducer, TasksStateType} from './tasks-reducer'
import {TodolistType} from '../../api/todolists-api'

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    let todolist: TodolistType = {
        title: 'new todolist',
        id: 'any id',
        addedDate: '',
        order: 0
    }

    // @ts-ignore
    const action = todolistsThunk.addTodolistTC(todolist);
// @ts-ignore
    const endTasksState = tasksReducer(startTasksState, action)
    // @ts-ignore
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;
// @ts-ignore
    expect(idFromTasks).toBe(action.payload.todolist.id);
    // @ts-ignore
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
