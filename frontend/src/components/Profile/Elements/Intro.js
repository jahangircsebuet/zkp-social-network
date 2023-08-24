import React from "react";
import "./intro.css";

function Intro({ profile }) {
    return (
        <div id="intro">
            <h3>Intro</h3>
            <p>
                Bio <br />
                {profile.bio ? profile.bio : `No bio, yet.`}
            </p>
            {profile.lives_in && profile.lives_in !== ", " && (
                <p>{`Lives in ${profile.lives_in}`}</p>
            )}
            {profile.born_from && profile.born_from !== ", " && (
                <p>{`From ${profile.born_from}`}</p>
            )}
        </div>
    );
}

export default Intro;
