// constants
const CREATE_LIKE = "like/CREATE_LIKE";
const READ_LIKE = "like/READ_LIKE";
const DELETE_LIKE = "like/DELETE_LIKE";

const createLike = like => ({
    type: CREATE_LIKE,
    payload: like,
});

const readLikes = likes => ({
    type: READ_LIKE,
    payload: likes,
});

const deleteLike = id => ({
    type: DELETE_LIKE,
    payload: id,
});

export const makeLike = (post_id, comment_id) => async dispatch => {
    const response = await fetch("/api/likes/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id, comment_id }),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createLike(data));
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

export const getLikes = () => async dispatch => {
    const response = await fetch(`/api/likes/`);
    if (response.ok) {
        const data = await response.json();
        dispatch(readLikes(data));
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

export const removeLike = likeId => async dispatch => {
    const response = await fetch(`/api/likes/${likeId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(deleteLike(data));
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
        case CREATE_LIKE:
            const createState = { ...state };
            createState[action.payload.id] = action.payload;
            return createState;
        case READ_LIKE:
            const readState = {};
            action.payload.likes.forEach(like => {
                readState[like.id] = like;
            });
            return readState;
        case DELETE_LIKE:
            const deleteState = { ...state };
            delete deleteState[action.payload.id];
            return deleteState;
        default:
            return state;
    }
}
