import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import friendsIcon from "../../images/friends-icon.png";
import defaultProfileIcon from "../../images/default-profile.png";
import "./leftSideBar.css";
import LogoutButton from "../../auth/LogoutButton";

import { useSelector } from "react-redux";

function LeftSideBar() {
    console.log("function LeftSideBar()");
    const [profilePic, setProfilePic] = useState(defaultProfileIcon);
    const user = useSelector(state => state.session.user);
    console.log("user");
    console.log(user);

    useEffect(() => {
        if (user.profile_pic) setProfilePic(user.profile_pic);
    }, [user]);

    return (
        <div id="left-sidebar">
            <Link to={`/profile/${user.id}/`}>
                <img
                    src={profilePic}
                    alt="profile"
                    className="profile-img-circle"
                    onError={() => setProfilePic(defaultProfileIcon)}
                />
                {`${user.first_name} ${user.last_name}`}
            </Link>
            <Link to="/friends/list/">
                <img src={friendsIcon} alt="friends" />
                Friends
            </Link>
            {/* <Link to="/logout">
                <img src={friendsIcon} alt="logout" />
                Logout
            </Link> */}
            <LogoutButton />
        </div>
    );
}

export default LeftSideBar;
