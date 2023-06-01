import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makePost } from "../../../store/posts";
import { Modal } from "../../Modal";
import defaultProfilePic from "../../images/default-profile.png";
import "../../Home/Elements/postFeed.css";

// Form used to create a post
function CreatePostForm() {
    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [errors, setErrors] = useState([]);
    const [textErrors, setTextErrors] = useState([]);
    const [imageErrors, setImageErrors] = useState([]);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [profilePic, setProfilePic] = useState(defaultProfilePic);

    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);

    const submit = async e => {
        e.preventDefault();
        setErrors([]);
        let image_link = "";

        const imageData = new FormData();
        imageData.append("image", image);

        const imageRes = await fetch(`http://localhost:5000/api/images/`, {
            method: "POST",
            body: imageData,
        });

        if (imageRes.ok) {
            image_link = await imageRes.json();
            image_link = image_link.url;
        } else if (imageRes.status < 500) {
            const data = await imageRes.json();
            if (data.errors) {
                return [data.errors];
            }
        } else {
            return ["An error occurred. Please try again."];
        }

        const data = await dispatch(makePost(text, image_link));

        if (data) {
            //Show errors
            setErrors(data);
        } else {
            //Close modal
            setText("");
            setImage("");
            setErrors([]);
            setShowCreatePost(false);
        }
    };

    useEffect(() => {
        if (user.profile_pic) setProfilePic(user.profile_pic);
    }, [user]);

    useEffect(() => {
        const textErrs = [];
        const imageErrs = [];
        errors.forEach(error => {
            error = error.split(" : ");
            if (error[0] === "text") textErrs.push(error[1]);
            if (error[0] === "image") imageErrs.push(error[1]);
        });
        setTextErrors(textErrs);
        setImageErrors(imageErrs);
    }, [errors]);

    return (
        <>
            {showCreatePost && (
                <Modal onClose={() => setShowCreatePost(false)}>
                    <h2>Create post</h2>
                    <form className="post-form" onSubmit={submit}>
                        {textErrors.length > 0 && (
                            <div className="errors">
                                {textErrors.map((error, ind) => (
                                    <div className="error" key={ind}>
                                        {error}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="post-required"></div>
                        <textarea
                            name="text"
                            placeholder="What's on your mind?"
                            value={text}
                            onChange={e => setText(e.target.value)}
                        />
                        {imageErrors.length > 0 && (
                            <div className="post-errors">
                                {imageErrors.map((error, ind) => (
                                    <div className="error" key={ind}>
                                        {error}
                                    </div>
                                ))}
                            </div>
                        )}
                        <label className="custom-file-upload">
                            <input
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={e => setImage(e.target.files[0])}
                            />
                            {image ? image.name : `Upload Photo`}
                        </label>
                        <button>Post</button>
                    </form>
                </Modal>
            )}
            <div id="create-post">
                <img
                    src={profilePic}
                    alt="profile"
                    onError={() => setProfilePic(defaultProfilePic)}
                    className="profile-img-circle"
                />
                <button className="create-post-form-button" onClick={() => setShowCreatePost(true)}>
                    What's on your mind, {user.first_name}?
                </button>
            </div>
        </>
    );
}

export default CreatePostForm;
