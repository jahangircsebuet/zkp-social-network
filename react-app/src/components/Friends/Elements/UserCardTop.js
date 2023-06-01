import React from "react";
import defaultProfilePic from "../../images/default-profile.png";
import "./userCard.css";

function UserCardTop({ cardUser }) {
    return (
        <div className="cardTop">
            <img
                src={cardUser.profile_pic ? cardUser.profile_pic : defaultProfilePic}
                alt="profile"
            />
            <div>{`${cardUser.first_name} ${cardUser.last_name}`}</div>
        </div>
    );
}

export default UserCardTop;
