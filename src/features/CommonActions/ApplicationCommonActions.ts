import {createAction} from "@reduxjs/toolkit";
import {RequestStatusType} from "../Application/app-reducer";

export const setAppStatus = createAction<{status: RequestStatusType }>('app/setAppStatus')
export const setAppError = createAction<{error: string | null }>('app/setAppError')