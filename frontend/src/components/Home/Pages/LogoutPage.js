import React from "react";
import { useDispatch } from "react-redux";
import LogInPage from "./LogInPage";
import { logout } from "../../../store/session";


function LogoutPage() {

    const dispatch = useDispatch();
    const onLogout = async e => {
        console.log("calling logout");
        await dispatch(logout());
    };
    return <main style={{ minHeight: "100vh" }}><LogInPage /></main>;
}

export default LogoutPage;
