import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestFriend } from "../../../../store/sentRequests";
import { removeUser } from "../../../../store/users";
import UserCardTop from "../UserCardTop";

function UserCard({ friend }) {
    const user = useSelector(state => state.session.user);

    const dispatch = useDispatch();

    const addFriend = async () => {
        await dispatch(requestFriend(user.id, friend.id));
        dispatch(removeUser(friend));
    };
    return (
        <div className="userCard">
            <UserCardTop cardUser={friend} />
            <button onClick={addFriend}>Add Friend</button>
        </div>
    );
}

export default UserCard;
