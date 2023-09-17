import cookie from "react-cookie";
import NotFound from "../components/NotFound/NotFound";
import { type } from "@testing-library/user-event/dist/type";

// constants
const SET_USER = "session/SET_USER";
const READ_USER = "session/READ_USER";
const UPDATE_USER = "session/UPDATE_USER";
const REMOVE_USER = "session/REMOVE_USER";

const setUser = data => ({
    type: SET_USER,
    payload: data,
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


// const setCookie = () => {
//     let d = new Date();
//     d.setTime(d.getTime() + (30*60*1000));

// };

// const [cookies, setCookie] = useCookies(['user']);
// const setTokenInCookie = (token) => {
//     setCookie('token', token, { path: '/' });
//  };

// const initialState = { user: null };
const initialState = {
    user: null,
    token: null,
    isAuthenticated: localStorage.getItem('token') === 'null'? true : false, 
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
    const response = await fetch("http://localhost:5000/authenticate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
        body: JSON.stringify({}),
    });

    if (response.ok) {
        const data = await response.json();
        console.log("authenticate response data");
        console.log(data);

        dispatch(setUser(data));
    }
};

export const login = (email, password) => async dispatch => {
    console.log("export const login");
    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log("login api response data");
        console.log(data);
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
    const response = await fetch("http://localhost:5000/logout", {
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
    (firstName, lastName, email, reEmail, password, confirmPassword, birthday, gender) =>
    async dispatch => {
        console.log("export const signUp");
        const response = await fetch("http://localhost:5000/signup", {
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
                gender,
            }),
        });

        const result = {
            success: false,
        };

        if (response.ok) {
            const data = await response.json();
            dispatch(setUser(data));
            result.success = true;
            return result;
        } else if (response.status < 500) {
            const data = await response.json();
            if (data.errors) {
                result.success = false;
                result.errors = data.errors;
                return result;
            }
        } else {
            result.success = false;
            result.errors = ["An error occurred. Please try again."];
            return result;
        }
    };

export const editUser = (bio, born_from, cover_pic, profile_pic, lives_in) => async dispatch => {
    console.log("edit user");

    let image_link = "";
    let api_url = "http://localhost:5000/images";

    let token = null;
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
    }
    console.log("token: " + token);

    const profilePicData = new FormData();
    profilePicData.append("image", profile_pic);

    if(typeof profile_pic != "undefined") {
        // calling api to store profile photo
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
    }

    image_link = "";
    const coverData = new FormData();
    coverData.append("image", cover_pic);

    if(typeof cover_pic != "undefined") {
        // calling api to store cover photo
        const imageCoverRes = await fetch(api_url, {
            method: "POST",
            headers: {
                "token": token,
            },
            body: coverData,
        });

        if (imageCoverRes.ok) {
            image_link = await imageCoverRes.json();
            console.log("cover photo -> image_link: " + image_link);
            cover_pic = image_link.url;
        } else if (imageCoverRes.status < 500) {
            const data = await imageCoverRes.json();
            if (data.errors) {
                return [data.errors];
            }
        } else {
            return ["An error occurred. Please try again."];
        }
    }

    let profile_api_url = "http://localhost:5000/profile";

    if(typeof cover_pic == "undefined") {
        cover_pic = "";
    }

    if(typeof profile_pic == "undefined") {
        profile_pic = "";
    }

    let profile_data = { bio, born_from, cover_pic, profile_pic, lives_in };
    const response = await fetch(profile_api_url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
        body: JSON.stringify(profile_data),
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
    switch (action.type) {
        case SET_USER:
            let user = null;
            let token = null;
            let authenticated = false;

            if(action.payload.isAuthenticated) {
                // set the access token
                localStorage.setItem("token", action.payload.token);
                user = action.payload.user;
                authenticated = action.payload.isAuthenticated;
                token = action.payload.token;
            }
                
            return { 
                user: user,
                isAuthenticated: authenticated,
                token: token
            };
        case READ_USER:
            return { ...state };
        case UPDATE_USER:
            const updateState = { ...state };
            updateState.user = action.payload.user;
            return updateState;
        case REMOVE_USER:
            console.log("REMOVE_USER reducer");
            localStorage.setItem("token", null);
            
            const removeState = { ...state };
            removeState.user = null;
            removeState.isAuthenticated = false;
            removeState.token = null;
            return removeState;
        default:
            const defaultState = { ...state };
            return defaultState;
    }
}
