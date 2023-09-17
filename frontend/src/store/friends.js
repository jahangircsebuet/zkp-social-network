// constants
const CREATE_FRIENDS = "friend/CREATE_FRIENDS";
const READ_FRIENDS = "friend/READ_FRIENDS";
const UPDATE_FRIENDS = "friend/UPDATE_FRIENDS";
const DELETE_FRIENDS = "friend/DELETE_FRIENDS";

const readFriends = friends => ({
    type: READ_FRIENDS,
    payload: friends,
});

const updateFriend = friend => ({
    type: UPDATE_FRIENDS,
    payload: friend,
});

const deleteFriend = id => ({
    type: DELETE_FRIENDS,
    payload: id,
});

// Read all friends.
export const getFriends = () => async dispatch => {
    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    console.log("token: " + token);
    // const response = await fetch(`http://localhost:5000/friends`);
    const response = await fetch(`http://localhost:5000/friends`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(readFriends(data));
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

// Update (Accept) friend request.
export const acceptFriend = (user_id, friend_id) => async dispatch => {
    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    console.log("token: " + token);
    const response = await fetch(`http://localhost:5000/friends/requests`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
        body: JSON.stringify({ user_id, friend_id }),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updateFriend(data));
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

// Delete a friend or decline friend request.
export const removeFriend = (user_id, friend_id) => async dispatch => {
    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    console.log("token: " + token);
    const response = await fetch(`http://localhost:5000/friends`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
        body: JSON.stringify({ user_id, friend_id }),
    });
    if (response.ok) {
        dispatch(deleteFriend(friend_id));
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

const initialState = {};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case CREATE_FRIENDS:
            const createState = { ...state };
            createState[action.payload.id] = action.payload;
            return createState;
        case READ_FRIENDS:
            const readState = {};
            action.payload.friends.forEach(friend => {
                readState[friend.id] = friend;
            });
            return readState;
        case UPDATE_FRIENDS:
            const updateState = { ...state };
            updateState[action.payload.id] = action.payload;
            return updateState;
        case DELETE_FRIENDS:
            const deleteState = { ...state };
            delete deleteState[action.payload];
            return deleteState;
        default:
            return state;
    }
}
