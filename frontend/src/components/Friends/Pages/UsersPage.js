import React from "react";
import Users from "../Elements/Users/Users";
import FriendSideBar from "./FriendSideBar";
import "./friendPage.css";

function UsersPage() {
    return (
        <div className="friend-page">
            <FriendSideBar />
            <Users />
        </div>
    );
}

export default UsersPage;
