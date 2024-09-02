import React, {useCallback, useEffect, useState} from 'react'
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm'
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan'
import {Task} from './Task/Task'
import {TaskStatuses, TaskType} from '../../../api/todolists-api'
import {FilterValuesType, TodolistDomainType} from '../todolists-reducer'
import {tasksThunks} from '../tasks-reducer'
import {useAppDispatch} from '../../../hooks/useAppDispatch';
import {Button, IconButton, Paper} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {useActions} from "../../../app/store";
import {tasksActions, todolistsActions} from "../index";

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
}

export const Todolist = React.memo(function ({demo = false, ...props}: PropsType) {

    const dispatch = useAppDispatch()

    const {changeTodolistFilter, removeTodolist, changeTodolistTitle} = useActions(todolistsActions)
    const {addTask, updateTask, removeTask} = useActions(tasksActions)
    const [filter, setFilter] = useState<FilterValuesType>('all')


    const changeTaskStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        updateTask({taskId, domainModel: {status}, todolistId})
    }, []);

    const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
        updateTask({taskId, domainModel: {title}, todolistId})
    }, []);

    useEffect(() => {
        if (demo) {
            return
        }
        const thunk = tasksThunks.fetchTasks(props.todolist.id)
        dispatch(thunk)
    }, [])

    const addTaskCallback = useCallback(async (title: string) => {
        addTask({title, todolistId: props.todolist.id})
    }, [props.todolist.id])

    const removeTodo = () => {
        removeTodolist(props.todolist.id)
    }
    const changeTodoTitle = useCallback((title: string) => {
        changeTodolistTitle({id: props.todolist.id, title})
    }, [props.todolist.id, changeTodolistTitle])

    const onAllClickHandler = useCallback(() => {
        changeTodolistFilter({
            filter: "all",
            id: props.todolist.id
        })
        setFilter('all')
    }, [props.todolist.id])
    const onActiveClickHandler = useCallback(() => {
        changeTodolistFilter({
            filter: "active",
            id: props.todolist.id
        })
        setFilter('active')
    }, [props.todolist.id])
    const onCompletedClickHandler = useCallback(() => {
        changeTodolistFilter({
            filter: "completed",
            id: props.todolist.id
        })
        setFilter('completed')
    }, [props.todolist.id])


    let tasksForTodolist = props.tasks

    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <Paper style={{padding: '10px', position: 'relative'}}>
        <IconButton onClick={removeTodo} disabled={props.todolist.entityStatus === 'loading'}
        style={{position: 'absolute', right: '5px', top:'5px'}}
        >
            <Delete/>
        </IconButton>

        <h3><EditableSpan value={props.todolist.title} onChange={changeTodoTitle}/>
        </h3>
        <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.todolist.id} />)
            }
            {
               !tasksForTodolist.length && <div style={{padding: '10px', color: 'grey'}}>No task</div>
            }
        </div>
        <div style={{paddingTop: '10px', display: 'flex'}}>
            <FilterButton title={'all'} filterButton={'all'} filter={filter} color={"inherit"}
                          onClickHandler={onAllClickHandler}/>
            <FilterButton title={'active'} filterButton={'active'} filter={filter} color={"primary"}
                          onClickHandler={onActiveClickHandler}/>
            <FilterButton title={'completed'} filterButton={'completed'} filter={filter} color={"secondary"}
                          onClickHandler={onCompletedClickHandler}/>
        </div>
    </Paper>
})

type FilterButtonPropsType = {
    onClickHandler: () => void
    filter: FilterValuesType
    filterButton: FilterValuesType
    color: "error" | "inherit" | "primary" | "secondary" | "success" | "info" | "warning"
    title: string
}
const FilterButton: React.FC<FilterButtonPropsType> = ({onClickHandler, filter, color, filterButton, title}) => {

    return <Button sx={{}} variant={filter === filterButton ? 'outlined' : 'text'}
                   onClick={onClickHandler}
                   color={color}
    >{title}
    </Button>
}



