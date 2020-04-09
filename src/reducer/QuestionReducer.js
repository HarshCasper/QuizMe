import * as types from '../actions/action-types';

export default (state = [], action) => {
    switch (action.type) {
        case types.QUESTION_GET_SUCCESS:
            return {
                ...state,
                questionGetSuccess: action.updatePayload.data
            };
        case types.QUESTION_GET_FAILURE:
            return {
                ...state,
                questionGetFailure: action.updatePayload.data
            };
        default:
            return state;
    }
};
