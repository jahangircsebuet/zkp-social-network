import React from "react";
import { NavLink } from "react-router-dom";

function FriendSideBar() {
    return (
        <div className="friend-sidebar">
            <h2>Friends</h2>
            <NavLink to="/friends/" exact={true}>
                Home
            </NavLink>
            <NavLink to="/friends/requests" exact={true}>
                Friend Requests
            </NavLink>
            <NavLink to="/friends/list" exact={true}>
                All Friends
            </NavLink>
        </div>
    );
}

export default FriendSideBar;
