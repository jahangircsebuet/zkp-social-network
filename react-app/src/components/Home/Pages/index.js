import React from "react";
import { useSelector } from "react-redux";
import HomePage from "./HomePage";
import LogInPage from "./LogInPage";

function Home() {
    const user = useSelector(state => state.session.user);

    return <main style={{ minHeight: "100vh" }}>{user ? <HomePage /> : <LogInPage />}</main>;
}

export default Home;
