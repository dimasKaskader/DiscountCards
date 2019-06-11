import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import user from './user'
import company from './company'

const initialState = { //начальные переменные в сторе
    loggedIn: false,
    Vova : 'жопа',

}

const init = (state = initialState, {flag, type})=>{  //редюсер начального стейта
    switch(type) {
        case 'LOGGIN_LOGOUT': //поменять
        return {...state, 
            loggedIn: flag
        }
        default:
        return state;
    }
}



const rootReducer = combineReducers({
    init,
    routing:routerReducer,
    user,
    company
});

export default rootReducer;