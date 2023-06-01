// constants
const CREATE_COMMENT = "comment/CREATE_COMMENT";
const READ_COMMENT = "comment/READ_COMMENT";
const UPDATE_COMMENT = "comment/UPDATE_COMMENT";
const DELETE_COMMENT = "comment/DELETE_COMMENT";

const createComment = comment => ({
    type: CREATE_COMMENT,
    payload: comment,
});

const readComments = comments => ({
    type: READ_COMMENT,
    payload: comments,
});

const updateComment = comment => ({
    type: UPDATE_COMMENT,
    payload: comment,
});

const deleteComment = id => ({
    type: DELETE_COMMENT,
    payload: id,
});

export const makeComment = (post_id, text) => async dispatch => {
    const created_at = new Date().toUTCString();
    const edited_at = new Date().toUTCString();
    const response = await fetch("/api/comments/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id, text, created_at, edited_at }),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createComment(data));
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

export const getComments = postId => async dispatch => {
    const response = await fetch(`/api/comments/${postId}/`);
    if (response.ok) {
        const data = await response.json();
        dispatch(readComments(data));
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

export const editComment = (post_id, comment_id, text) => async dispatch => {
    const edited_at = new Date().toUTCString();
    const response = await fetch(`/api/comments/${comment_id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id, text, edited_at }),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updateComment(data));
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

export const removeComment = commentId => async dispatch => {
    const response = await fetch(`/api/comments/${commentId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(deleteComment(data));
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
        case CREATE_COMMENT:
            const createState = { ...state };
            const post = createState[action.payload.post_id];
            post.comments[action.payload.id] = action.payload;
            return createState;
        case READ_COMMENT:
            const readState = { ...state };
            action.payload.comments.forEach(comment => {
                readState[comment.post_id].comments[comment.id] = comment;
            });
            return readState;
        case UPDATE_COMMENT:
            const updateState = { ...state };
            updateState[action.payload.post_id].comments[action.payload.id] = action.payload;
            return updateState;
        case DELETE_COMMENT:
            const deleteState = { ...state };
            delete deleteState[action.payload.post_id].comments[action.payload.id];
            return deleteState;
        default:
            return state;
    }
}
