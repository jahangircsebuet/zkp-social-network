// constants
const SET_USER = "session/SET_USER";
const READ_USER = "session/READ_USER";
const UPDATE_USER = "session/UPDATE_USER";
const REMOVE_USER = "session/REMOVE_USER";

const setUser = user => ({
    type: SET_USER,
    payload: user,
});

const readUser = () => ({
    type: READ_USER,
    payload: null,
});

const updateUser = user => ({
    type: UPDATE_USER,
    payload: user,
});

const removeUser = () => ({
    type: REMOVE_USER,
});

// const initialState = { user: null };
const initialState = {
    user: null,
    token: null,
    isAuthenticated: localStorage.getItem('token') ? true : false, 
    isLoading: false,
    isRegistered: false
 }

export const authenticate = () => async dispatch => {
    console.log("export const authenticate");
    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
        dispatch(readUser());
    }
    console.log("token: " + token);
    const response = await fetch("http://localhost:5000/api/authenticate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token,
        }),
    });
    console.log("authenticate");
    console.log(response);

    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }
        dispatch(setUser(data));
    }
};

export const login = (email, password) => async dispatch => {
    console.log("export const login");
    const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
    console.log("response");
    console.log(response);

    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data));
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

export const logout = () => async dispatch => {
    console.log("export const logout");
    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    console.log("token: " + token);
    const response = await fetch("http://localhost:5000/api/logout", {
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
    });

    if (response.ok) {
        dispatch(removeUser());
    }
};

export const signUp =
    (firstName, lastName, email, reEmail, password, confirmPassword, birthday) =>
    async dispatch => {
        console.log("export const signUp");
        const response = await fetch("http://localhost:5000/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                reEmail,
                password,
                confirmPassword,
                birthday,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(setUser(data));
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

export const editUser = (bio, born_from, cover_pic, profile_pic, lives_in) => async dispatch => {
    console.log("export const editUser");
    let image_link = "";
    let api_url = "http://localhost:5000/api/images";

    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    console.log("token: " + token);

    const profilePicData = new FormData();
    profilePicData.append("image", profile_pic);

    const imageProfileRes = await fetch(api_url, {
        method: "POST",
        headers: {
            "token": token,
        },
        body: profilePicData,
    });

    if (imageProfileRes.ok) {
        image_link = await imageProfileRes.json();
        profile_pic = image_link.url;
    } else if (imageProfileRes.status < 500) {
        const data = await imageProfileRes.json();
        if (data.errors) {
            return [data.errors];
        }
    } else {
        return ["An error occurred. Please try again."];
    }

    image_link = "";
    const coverData = new FormData();
    coverData.append("image", cover_pic);

    const imageCoverRes = await fetch(api_url, {
        method: "POST",
        headers: {
            "token": token,
        },
        body: coverData,
    });

    if (imageCoverRes.ok) {
        image_link = await imageCoverRes.json();
        cover_pic = image_link.url;
    } else if (imageCoverRes.status < 500) {
        const data = await imageCoverRes.json();
        if (data.errors) {
            return [data.errors];
        }
    } else {
        return ["An error occurred. Please try again."];
    }

    let profile_api_url = "http://localhost:5000/api/profile";
    const response = await fetch(profile_api_url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
        body: JSON.stringify({ bio, born_from, cover_pic, profile_pic, lives_in }),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updateUser(data));
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

export default function reducer(state = initialState, action) {
    console.log("session.js -> export default function reducer");
    switch (action.type) {
        case SET_USER:
            console.log("payload");
            console.log(action.payload);
            localStorage.setItem("token", action.payload.token);
            let user = null;
            if(action.payload.isAuthenticated)
                user = action.payload.user
            return { 
                user: user,
                isAuthenticated: action.payload.isAuthenticated,
                token: action.payload.token
            };
        case READ_USER:
            return { ...state };
        case UPDATE_USER:
            const updateState = { ...state };
            updateState.user = action.payload;
            return updateState;
        case REMOVE_USER:
            localStorage.setItem("token", null);
            return { 
                user: null,
                isAuthenticated: false,
                token: null
            };
        default:
            const defaultState = { ...state };
            return defaultState;
    }
}
