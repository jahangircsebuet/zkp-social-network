// constants
const READ_FRIEND_REQUESTS = "request/READ_FRIEND_REQUESTS";
const DELETE_RECEIVED_REQUESTS = "request/DELETE_RECEIVED_REQUESTS";

const readRequests = requests => ({
    type: READ_FRIEND_REQUESTS,
    payload: requests,
});

const deleteRequest = request => ({
    type: DELETE_RECEIVED_REQUESTS,
    payload: request,
});

// Read all received friend requests.
export const getRequests = () => async dispatch => {
    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    console.log("token: " + token);
    // const response = await fetch(`http://localhost:5000/friends/requests/received`);
    const response = await fetch("http://localhost:5000/friends/requests/received", {
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

export const deleteReceivedRequest = request => async dispatch => {
    dispatch(deleteRequest(request));
};

const initialState = {};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case READ_FRIEND_REQUESTS:
            const readState = {};
            action.payload.friend_requests.forEach(request => {
                readState[request.id] = request;
            });
            return readState;
        case DELETE_RECEIVED_REQUESTS:
            const deleteState = { ...state };
            delete deleteState[action.payload.id];
            return deleteState;
        default:
            return state;
    }
}
