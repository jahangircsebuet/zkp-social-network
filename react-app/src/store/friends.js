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

export const getFriends = () => async dispatch => {
    const response = await fetch(`/api/friends/`);
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

export const acceptFriend = (user_id, friend_id) => async dispatch => {
    const response = await fetch(`/api/friends/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
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

export const removeFriend = (user_id, friend_id) => async dispatch => {
    const response = await fetch(`/api/friends/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
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
