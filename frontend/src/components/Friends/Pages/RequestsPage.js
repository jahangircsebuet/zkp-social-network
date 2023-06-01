import React from "react";
import { useSelector } from "react-redux";
import Requests from "../Elements/Requests/Requests";
import FriendSideBar from "./FriendSideBar";
import "./friendPage.css";

function RequestsPage() {
    const requests = useSelector(state => state.requests);

    return (
        <div className="friend-page">
            <FriendSideBar />
            <Requests requests={requests.received} />
        </div>
    );
}

export default RequestsPage;
