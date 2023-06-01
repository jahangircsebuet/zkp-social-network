// constants
const READ_USERS = "user/READ_USERS";
const DELETE_USER = "user/DELETE_USER";

const readUsers = users => ({
    type: READ_USERS,
    payload: users,
});

const deleteUser = user => ({
    type: DELETE_USER,
    payload: user,
});

export const getUsers = () => async dispatch => {
    const response = await fetch(`/api/users/`);
    if (response.ok) {
        const data = await response.json();
        dispatch(readUsers(data));
        return null;
    } else if (response.status < 500) {
        const data = await response.json();
        if (data.errors) {
            return data.errors;
        }
    } else {
        return ["An error occurred. Please try again."];
    }
};

export const removeUser = user => async dispatch => {
    dispatch(deleteUser(user));
};

const initialState = {};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case READ_USERS:
            const readState = {};
            action.payload.users.forEach(user => {
                readState[user.id] = user;
            });
            return readState;
        case DELETE_USER:
            const deleteState = { ...state };
            delete deleteState[action.payload.id];
            return deleteState;
        default:
            return state;
    }
}
