// constants
const CREATE_SENT_REQUESTS = "request/CREATE_SENT_REQUESTS";
const READ_SENT_REQUESTS = "request/READ_SENT_REQUESTS";
const DELETE_SENT_REQUESTS = "request/DELETE_SENT_REQUESTS";

const createRequest = request => ({
    type: CREATE_SENT_REQUESTS,
    payload: request,
});

const readRequests = requests => ({
    type: READ_SENT_REQUESTS,
    payload: requests,
});

const deleteRequest = request => ({
    type: DELETE_SENT_REQUESTS,
    payload: request,
});

// Create a friend request.
export const requestFriend = (user_id, friend_id) => async dispatch => {
    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    console.log("token: " + token);
    const response = await fetch("http://localhost:5000/friends/requests", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
        body: JSON.stringify({ user_id, friend_id }),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createRequest(data.friend));
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

// Read all sent requests.
export const getSentRequests = () => async dispatch => {
    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    console.log("token: " + token);
    // const response = await fetch(`/api/friends/requests/sent/`);
    const response = await fetch("/api/friends/requests/sent", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(readRequests(data));
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

export const deleteSentRequest = request => async dispatch => {
    dispatch(deleteRequest(request));
};

const initialState = {};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case CREATE_SENT_REQUESTS:
            const createState = { ...state };
            createState[action.payload.id] = action.payload;
            return createState;
        case READ_SENT_REQUESTS:
            const readState = {};
            action.payload.friend_requests.forEach(request => {
                readState[request.id] = request;
            });
            return readState;
        case DELETE_SENT_REQUESTS:
            const deleteState = { ...state };
            delete deleteState[action.payload.id];
            return deleteState;
        default:
            return state;
    }
}
