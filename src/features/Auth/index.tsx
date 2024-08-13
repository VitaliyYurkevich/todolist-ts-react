import * as authAsyncActions from './auth-actions'
import {slice, authReducer} from "./auth-reducer";


 const authActions = {
    ...authAsyncActions,
    ...slice.actions
}


export {
    authActions,
    authReducer
}