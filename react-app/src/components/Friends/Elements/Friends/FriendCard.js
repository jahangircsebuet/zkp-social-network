import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFriend } from "../../../../store/friends";
import UserCardTop from "../UserCardTop";

function FriendCard({ friend }) {
    const user = useSelector(state => state.session.user);

    const dispatch = useDispatch();

    const deleteFriend = () => {
        dispatch(removeFriend(user.id, friend.id));
    };
    return (
        <div className="userCard">
            <UserCardTop cardUser={friend} />
            <button onClick={deleteFriend}>Unfriend</button>
        </div>
    );
}

export default FriendCard;
