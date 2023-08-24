import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { acceptFriend, removeFriend } from "../../../../store/friends";
import { deleteReceivedRequest } from "../../../../store/receivedRequests";
import UserCardTop from "../UserCardTop";

function RequestCard({ request }) {
    const user = useSelector(state => state.session.user);

    const dispatch = useDispatch();

    const acceptRequest = async () => {
        await dispatch(acceptFriend(user.id, request.id));
        dispatch(deleteReceivedRequest(request));
    };

    const deleteFriend = async () => {
        await dispatch(removeFriend(user.id, request.id));
        dispatch(deleteReceivedRequest(request));
    };

    return (
        <div className="userCard">
            <UserCardTop cardUser={request} />
            <button onClick={acceptRequest}>Accept Friend Request</button>
            <button onClick={deleteFriend}>Decline Friend Request</button>
        </div>
    );
}

export default RequestCard;
