import React, { ChangeEvent, useCallback } from 'react'
import { Checkbox, IconButton } from '@mui/material'
import { EditableSpan } from '../../../../components/EditableSpan/EditableSpan'
import { Delete } from '@mui/icons-material'
import { TaskStatuses, TaskType } from '../../../../api/todolists-api'
import {useActions} from "../../../../app/store";
import {tasksActions} from "../../index";

type TaskPropsType = {
	task: TaskType
	todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {

	const { updateTask, removeTask} = useActions(tasksActions)

	const onClickHandler = useCallback(() => removeTask({taskId: props.task.id, todolistId: props.todolistId}), [props.task.id, props.todolistId]);

	const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		let newIsDoneValue = e.currentTarget.checked
		updateTask({taskId: props.task.id, domainModel: {status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New}, todolistId: props.todolistId})
	}, [props.task.id, props.todolistId]);

	const onTitleChangeHandler = useCallback((newValue: string) => {
		updateTask({taskId: props.task.id,domainModel: {title: newValue} , todolistId: props.todolistId})
	}, [props.task.id, props.todolistId]);

	return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}
	style={{position: 'relative'}}
	>
		<Checkbox
			checked={props.task.status === TaskStatuses.Completed}
			color="primary"
			onChange={onChangeHandler}
		/>

		<EditableSpan value={props.task.title} onChange={onTitleChangeHandler}/>
		<IconButton onClick={onClickHandler} style={{position: 'absolute', top: '2px', right: '2px'}}>
			<Delete/>
		</IconButton>
	</div>
})
