
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from 'redux'
import {appActions} from "../app/app-reducer";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        // @ts-ignore
        dispatch(appActions.setAppError({error: data.messages[0]}))
    } else {
        // @ts-ignore
        dispatch(appActions.setAppError({error: 'Some error occurred'}))
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
    // @ts-ignore
    dispatch(appActions.setAppError({error: error.message ? error.message : 'Some error occurred'}))
    dispatch(appActions.setAppStatus({status: 'failed'}))
}
