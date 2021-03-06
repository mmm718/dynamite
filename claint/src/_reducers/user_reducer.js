import {LOGIN_USER, REGISTER_USER, AUTH_USER} from '../_actions/types'



// switch 사용하는 이유
//type들이 많아짐 > 그럴때마다 다른 조치 시킴

export default function (state = {}, action) {

    switch (action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload}
            break;

        case REGISTER_USER:
            return {...state, register: action.payload }
            break;

        case AUTH_USER:
            return {...state, userData: action.payload}
            break;
    
        default:
            return state;
    }
}