import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { authenticate } from "./store/session";
import NavBar from "./components/Navbar/NavBar";
import Home from "./components/Home/Pages";
import LogoutPage from "./components/Home/Pages/LogoutPage";
import FriendsPage from "./components/Friends/Pages/FriendsPage";
import UsersPage from "./components/Friends/Pages/UsersPage";
import RequestsPage from "./components/Friends/Pages/RequestsPage";
import ContactPage from "./components/Contact/pages/ContactPage";
import ProfilePage from "./components/Profile/Pages/ProfilePage";
import NotFound from "./components/NotFound/NotFound";
import authContext from "./components/Contexts/authContext";
import { Redirect } from 'react-router';
import DefaultPageForInvalidURL from "./components/Home/Pages/DefaultPageForInvalidURL";

function App() {
    const [loaded, setLoaded] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await dispatch(authenticate());
            setLoaded(true);
        })();
    }, [dispatch]);

    if (!loaded) {
        return null;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/contact"
                    element={<ContactPage />}
                />
                <Route
                    path="/friends"
                    element={<UsersPage />}
                />
                <Route
                    path="/friends/requests"
                    element={<RequestsPage />}
                />
                <Route
                    path="/friends/list"
                    element={<FriendsPage />}
                />
                <Route
                    path="/profile/:id"
                    element={<ProfilePage />}
                />
                <Route
                    path="/logout"
                    element={<LogoutPage />}
                />
                <Route
                    path=""
                    element={<Home />}
                />
                <Route
                    path=""
                    element={<NotFound />}
                />
                 <Route path="*" element={<DefaultPageForInvalidURL />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
