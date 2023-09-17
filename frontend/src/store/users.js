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
    console.log("users.js -> getUsers");
    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    console.log("token: " + token);
    // const response = await fetch(`http://localhost:5000/users`);
    const response = await fetch(`http://localhost:5000/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
    });
    if (response.ok) {
        const data = await response.json();
        console.log("getUsers  response");
        console.log(data);
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
