import React from "react";
import defaultProfilePic from "../../images/default-profile.png";

function PosterInfo({ poster }) {
    return (
        <>
            {poster && (
                <div className="poster-info">
                    <img
                        src={poster.profile_pic ? poster.profile_pic : defaultProfilePic}
                        alt="profile"
                    />
                    <h3>{`${poster.first_name} ${poster.last_name}`}</h3>
                </div>
            )}
        </>
    );
}

export default PosterInfo;
