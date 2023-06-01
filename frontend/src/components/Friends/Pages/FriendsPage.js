import React from "react";
import Friends from "../Elements/Friends/Friends";
import FriendSideBar from "./FriendSideBar";
import "./friendPage.css";

function FriendsPage() {
    return (
        <div className="friend-page">
                <FriendSideBar />
                <Friends />
        </div>
    );
}

export default FriendsPage;
