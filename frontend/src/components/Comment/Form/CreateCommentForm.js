import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { makeComment } from "../../../store/comments";
import "./commentForm.css";

// Form used to create a comment
function CreateCommentForm({ post_id }) {
    const [text, setText] = useState("");
    const [errors, setErrors] = useState([]);

    const dispatch = useDispatch();

    const submit = async e => {
        if (e.preventDefault) e.preventDefault();
        setErrors([]);

        const data = await dispatch(makeComment(post_id, text));

        if (data) {
            //Show errors
            setErrors(data);
        } else {
            setText("");
            setErrors([]);
        }
    };

    const checkEnter = e => {
        if (e.keyCode === 13 && !e.shiftKey) {
            const form = document.querySelector(".comment-form");
            submit(form);
        }
    };

    return (
        <div>
            <form className="comment-form" onSubmit={submit}>
                {errors.length > 0 && (
                    <div className="errors">
                        {errors.map((error, ind) => (
                            <div className="error" key={ind}>
                                {error.split(":")[1]}
                            </div>
                        ))}
                    </div>
                )}
                <textarea
                    id={`comment-${post_id}-input`}
                    name="text"
                    placeholder="Write a comment..."
                    value={text}
                    onKeyDown={checkEnter}
                    onChange={e => setText(e.target.value)}
                />
                <button className="comment-submit-button">Comment</button>
            </form>
        </div>
    );
}

export default CreateCommentForm;
