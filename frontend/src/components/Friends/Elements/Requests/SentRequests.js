import React from "react";
import { Modal } from "../../../Modal";
import RequestSentCard from "./RequestSentCard";

function SentRequests({ requests, setShowSentRequests }) {
    return (
        <Modal onClose={() => setShowSentRequests(false)}>
            <div>
                <h2>Sent Requests</h2>
                {Object.keys(requests).length ? (
                    Object.values(requests).map(request => {
                        return <RequestSentCard key={request.id} request={request} />;
                    })
                ) : (
                    <h3>No sent requests.</h3>
                )}
            </div>
        </Modal>
    );
}

export default SentRequests;
