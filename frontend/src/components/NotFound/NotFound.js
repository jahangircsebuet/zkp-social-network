import React from "react";
import { Link } from "react-router-dom";
import "./notFound.css";

function NotFound() {
    return (
        <div className="notFound">
            <h1>Page Not Found</h1>
            <Link to="/">Back to home</Link>
        </div>
    );
}

export default NotFound;
