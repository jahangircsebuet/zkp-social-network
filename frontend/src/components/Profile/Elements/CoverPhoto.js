import React from "react";
import "./coverPhoto.css";

function CoverPhoto({ coverPhoto, owner }) {
    // const [showEditCover, setShowEditCover] = useState(false);
    return (
        <div id="cover-photo">
            {coverPhoto && <img src={coverPhoto} alt="cover" id="coverImg" />}
            {/* {owner && !coverPhoto && (
                <button onClick={() => setShowEditCover(true)}>Add cover photo</button>
            )} */}
        </div>
    );
}

export default CoverPhoto;
