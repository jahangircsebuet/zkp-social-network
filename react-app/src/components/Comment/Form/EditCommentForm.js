import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editComment } from "../../../store/comments";
import "./commentForm.css";

// Form used to Edit a comment
function EditCommentForm({ comment, setShowEditComment }) {
    const [text, setText] = useState(comment.text);
    const [errors, setErrors] = useState([]);

    const dispatch = useDispatch();

    const submit = async e => {
        e.preventDefault();
        setErrors([]);

        const data = await dispatch(editComment(comment.post_id, comment.id, text));

        if (data) {
            //Show errors
            setErrors(data);
        } else {
            setText("");
            setErrors([]);
            setShowEditComment(false);
        }
    };

    const cancel = e => {
        e.preventDefault();
        setShowEditComment(false);
    };

    return (
        <div className="comment-edit">
            {errors.length > 0 && (
                <div className="comment-errors">
                    {errors.map((error, ind) => (
                        <div className="error" key={ind}>
                            {error.split(":")[1]}
                        </div>
                    ))}
                </div>
            )}
            <form className="comment-form" onSubmit={submit}>
                <textarea
                    name="text"
                    placeholder="Write a comment..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <button className="comment-submit-button">Update Comment</button>
                <button className="comment-edit-cancel" onClick={cancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditCommentForm;
