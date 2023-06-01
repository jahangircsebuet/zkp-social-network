// constants
const SET_USER = "session/SET_USER";
const UPDATE_USER = "session/UPDATE_USER";
const REMOVE_USER = "session/REMOVE_USER";

const setUser = user => ({
    type: SET_USER,
    payload: user,
});

const updateUser = user => ({
    type: UPDATE_USER,
    payload: user,
});

const removeUser = () => ({
    type: REMOVE_USER,
});

const initialState = { user: null };

export const authenticate = () => async dispatch => {
    const response = await fetch("/api/auth/", {
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }

        dispatch(setUser(data));
    }
};

export const login = (email, password) => async dispatch => {
    const response = await fetch("/api/auth/login", {
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
    const response = await fetch("/api/auth/logout", {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        dispatch(removeUser());
    }
};

export const signUp =
    (firstName, lastName, email, reEmail, password, confirmPassword, birthday) =>
    async dispatch => {
        const response = await fetch("/api/auth/signup", {
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
    let image_link = "";

    const profilePicData = new FormData();
    profilePicData.append("image", profile_pic);

    const imageProfileRes = await fetch(`http://localhost:5000/api/images/`, {
        method: "POST",
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

    const imageCoverRes = await fetch(`http://localhost:5000/api/images/`, {
        method: "POST",
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

    const response = await fetch(`/api/profile/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
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
    switch (action.type) {
        case SET_USER:
            return { user: { ...action.payload } };
        case UPDATE_USER:
            const updateState = { ...state };
            updateState.user = action.payload;
            return updateState;
        case REMOVE_USER:
            return { user: null };
        default:
            const defaultState = { ...state };
            return defaultState;
    }
}
