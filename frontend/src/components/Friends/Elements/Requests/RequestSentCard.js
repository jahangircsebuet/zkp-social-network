import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFriend } from "../../../../store/friends";
import { deleteSentRequest } from "../../../../store/sentRequests";
import defaultProfilePic from "../../../images/default-profile.png";

function RequestSentCard({ request }) {
    const user = useSelector(state => state.session.user);

    const dispatch = useDispatch();

    const deleteFriend = async () => {
        await dispatch(removeFriend(user.id, request.id));
        dispatch(deleteSentRequest(request));
    };

    return (
        <>
            {request && (
                <div className="requestCard">
                    <img
                        src={request.profile_pic ? request.profile_pic : defaultProfilePic}
                        alt="profile"
                    />
                    <div>{`${request.first_name} ${request.last_name}`}</div>
                    <button onClick={deleteFriend}>Rescind Friend Request</button>
                </div>
            )}
        </>
    );
}

export default RequestSentCard;
