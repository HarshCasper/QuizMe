import * as types from './action-types';
import axios from 'axios';
import { AsyncStorage } from 'react-native';

export const getQuestion = () => {
    return async dispatch => {
        axios({
            method: 'get',
            url: 'http://192.168.137.1:8093/Questions/getQuestion',
        }).then(response => {
            if (response) {
                if (response.data) {
                    dispatch({ type: types.QUESTION_GET_SUCCESS, updatePayload: response });
                } else {
                    dispatch({ type: types.QUESTION_GET_FAILURE, updatePayload: response });
                }
            }
        }).catch(error => {
            alert("Network Error");
        })
    }
}
