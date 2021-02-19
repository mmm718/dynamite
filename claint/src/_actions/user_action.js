import axios from 'axios'
import {LOGIN_USER,REGISTER_USER,AUTH_USER} from './types'

export function loginUser(dataTosubmit) {
    
    const request = axios.post('/api/users/login', dataTosubmit)
        .then(response => response.data)

        return {
            // reducer 보내기
            type: "LOGIN_USER",
            payload: request
        }

}


export function registerUser(dataTosubmit) {
    
    const request = axios.post('/api/users/register', dataTosubmit)
        .then(response => response.data)

        return {
            // reducer 보내기
            type: "REGISTER_USER",
            payload: request
        }

}



export function auth(dataTosubmit) {
    
    const request = axios.get('/api/users/auth')
        .then(response => response.data)

        return {
            // reducer 보내기
            type: "AUTH_USER",
            payload: request
        }

}
