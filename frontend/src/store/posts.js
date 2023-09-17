import comments from "./comments";
// constants
const CREATE_POST = "post/CREATE_POST";
const READ_POST = "post/READ_POST";
const UPDATE_POST = "post/UPDATE_POST";
const DELETE_POST = "post/DELETE_POST";

const createPost = post => ({
    type: CREATE_POST,
    payload: post,
});

const readPosts = posts => ({
    type: READ_POST,
    payload: posts,
});

const updatePost = post => ({
    type: UPDATE_POST,
    payload: post,
});

const deletePost = id => ({
    type: DELETE_POST,
    payload: id,
});

export const makePost = (text, image_link) => async dispatch => {
    const created_at = new Date().toUTCString();
    const edited_at = new Date().toUTCString();
    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    const response = await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
        body: JSON.stringify({ text, image_link, created_at, edited_at }),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createPost(data.post));
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

export const getPosts = () => async dispatch => {
    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    console.log("token: " + token);
//    const response = await fetch("http://localhost:5000/posts/");
    const response = await fetch(`http://localhost:5000/posts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
    });
    if (response.ok) {
        const data = await response.json();
        if(data.success) {
            // TODO fix the image url
            dispatch(readPosts(data));
        }
        
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

export const editPost = (postId, text, image_link) => async dispatch => {
    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    console.log("token: " + token);
    const edited_at = new Date().toUTCString();
    const response = await fetch(`http://localhost:5000/posts/${postId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
        body: JSON.stringify({ text, image_link, edited_at }),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updatePost(data.post));
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

export const removePost = postId => async dispatch => {
    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    console.log("token: " + token);
    const response = await fetch(`http://localhost:5000/posts/${postId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
        body: JSON.stringify(postId),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(deletePost(data));
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
        case CREATE_POST:
            console.log("reducer->CREATE_POST");
            console.log(action.payload);
            const createState = { ...state };
            createState[action.payload.id] = { ...action.payload, comments: {} };
            return createState;
        case READ_POST:
            const readState = {};
            console.log("action.payload");
            console.log(action.payload);
            action.payload.posts.forEach(post => {
                readState[post.id] = post;
            });
            return readState;
        case UPDATE_POST:
            const updateState = { ...state };
            updateState[action.payload.id] = action.payload;
            return updateState;
        case DELETE_POST:
            const deleteState = { ...state };
            delete deleteState[action.payload.id];
            return deleteState;
        default:
            const defaultState = { ...state, ...comments(state, action) };
            return defaultState;
    }
}
