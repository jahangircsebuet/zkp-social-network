import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriends } from "../../../../store/friends";
import FriendCard from "./FriendCard";

function Friends() {
    const friends = Object.values(useSelector(state => state.friends));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFriends());
    }, [dispatch]);

    return (
        <div className="cardContainer">
            {friends.length ? (
                Object.values(friends).map(friend => <FriendCard key={friend.id} friend={friend} />)
            ) : (
                <h2>No Friends!</h2>
            )}
        </div>
    );
}

export default Friends;
