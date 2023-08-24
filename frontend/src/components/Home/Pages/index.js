import React from "react";
import { useSelector } from "react-redux";
import HomePage from "./HomePage";
import LogInPage from "./LogInPage";

function Home() {
    console.log("function Home()");
    const session = useSelector(state => state.session);
    console.log("session");
    console.log(session);
    return <main style={{ minHeight: "100vh" }}>{session.isAuthenticated ? <HomePage /> : <LogInPage />}</main>;
}

export default Home;
