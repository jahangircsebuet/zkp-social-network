import React from "react";
import { useSelector } from "react-redux";
import "./photos.css";

function Photos({ profile }) {
    const posts = useSelector(state => state.posts);
    const photos = Object.values(posts)
        .filter(post => post.user_id === profile.id && post.image_link)
        .map(post => post.image_link);

    return (
        <div id="photos">
            <h3>Photos</h3>
            <div id="tiles">
                {photos.length > 0 ? (
                    photos.map(photo => {
                        return <img src={photo} alt="tile" key={photo} />;
                    })
                ) : (
                    <h4>No Photos, yet!</h4>
                )}
            </div>
        </div>
    );
}

export default Photos;
