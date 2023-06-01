import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./rightSideBar.css";
import defaultProfilePic from "../../images/default-profile.png";
import patrick from "../../images/patrick.png";
import { getFriends } from "../../../store/friends";

function RightSideBar() {
    const friends = Object.values(useSelector(state => state.friends));

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFriends());
    }, [dispatch]);

    return (
        <div id="right-sidebar">
            <h3>Looking for a developer?</h3>
            <div className="ad">
                <img src={patrick} alt="Patrick" />
                <span>
                    <h4>Patrick McPherson</h4>
                    <a
                        href="https://patrickmcpherson.codes/"
                        target="_blank"
                        without
                        rel="noreferrer">
                        View Portfolio
                    </a>
                </span>
            </div>
            <h3>Contacts</h3>
            {friends ? (
                friends.map(friend => {
                    return (
                        <Link key={friend.id} to={`/profile/${friend.id}/`}>
                            <div className="rightside-friend">
                                <img
                                    src={
                                        friend.profile_pic ? friend.profile_pic : defaultProfilePic
                                    }
                                    alt="profile"
                                />
                                <span>{`${friend.first_name} ${friend.last_name}`}</span>
                            </div>
                        </Link>
                    );
                })
            ) : (
                <h4>No friends!</h4>
            )}
        </div>
    );
}

export default RightSideBar;
