import React, { useEffect } from "react";
import RightSideBar from "../Elements/RightSideBar";
import LeftSideBar from "../Elements/LeftSideBar";
import PostFeed from "../Elements/PostFeed";
import "./home.css";
import { useDispatch } from "react-redux";
import { getLikes } from "../../../store/likes";
import { Link } from "react-router-dom";
import "./defaultPageForInvalidURL.css";

function DefaultPageForInvalidURL() {
    return (
        <div id="invalidURL">
            <h1>Page not found.</h1>
            <Link to="/">Back to home</Link>
        </div>
    );
}

export default DefaultPageForInvalidURL;