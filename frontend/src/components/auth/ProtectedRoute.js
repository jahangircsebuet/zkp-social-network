import React from "react";
import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = props => {
    console.log("const ProtectedRoute");
    const user = useSelector(state => state.session.user);
    console.log(user);
    return <Route {...props}>{user ? props.children : <Navigate to="/" />}</Route>;
};

export default ProtectedRoute;
