import React from "react";
import "./bigProfilePicture.css";
import defaultProfilePic from "../../images/default-profile.png";

function BigProfilePicture({ profile_pic }) {
    return (
        <div id="bigPic">
            <img id="bigPicImg" src={profile_pic ? profile_pic : defaultProfilePic} alt="profile" />
        </div>
    );
}

export default BigProfilePicture;
