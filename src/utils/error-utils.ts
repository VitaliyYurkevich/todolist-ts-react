
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from 'redux'
import {appActions} from "../features/Application/app-reducer";
import axios from "axios";
import {AppDispatch} from "../app/store";
import {setAppError, setAppStatus} from "../features/CommonActions/ApplicationCommonActions";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {

        dispatch(setAppError({error: data.messages[0]}))
    } else {

        dispatch(setAppError({error: 'Some error occurred'}))
    }
    dispatch(setAppStatus({status: 'failed'}))
}

export const handleServerNetworkError = (error: unknown, dispatch: AppDispatch) => {
    let errorMessage = 'Some error occurred'
    if(axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error?.message || errorMessage;
    } else if (error instanceof Error) {
        errorMessage = `Native error : ${error.message}`
    } else {
        errorMessage = JSON.stringify(error)
    }

    // @ts-ignore
    dispatch(setAppError({ error: errorMessage }));
    dispatch(setAppStatus({ status: "failed" }));
}
