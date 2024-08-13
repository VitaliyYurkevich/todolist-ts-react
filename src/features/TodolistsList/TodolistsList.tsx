import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {AppRootStateType, useActions} from '../../app/store'
import {TodolistDomainType, todolistsThunk} from './todolists-reducer'
import {TasksStateType} from './tasks-reducer'
import {Grid, Paper} from '@mui/material'
import {AddItemForm} from '../../components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from 'react-router-dom'
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {selectIsLoggedIn} from "../Auth/selectors";
import {tasksActions, todolistsActions} from "./index";
import {authActions} from "../Auth/auth-reducer";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {addTodolist} = useActions(todolistsActions)

    const addTodolistCallback = useCallback(async (title: string) => {
        addTodolist(title)
    }, [])

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        const thunk = todolistsThunk.fetchTodolistsTC()

       dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
        dispatch(thunk)
    }, [])


    if (!isLoggedIn) {

        return <Navigate to={"/login"}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolistCallback}/>
        </Grid>
        <Grid container spacing={3} style={{flexWrap: 'nowrap', overflowX: 'scroll'}}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px', width: '300px'}}>
                            <Todolist key={tl.id}
                                todolist={tl}
                                tasks={allTodolistTasks}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
