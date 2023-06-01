import React from "react";
import LogoutButton from "../auth/LogoutButton";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Dropdown({ setShowDropdown }) {
    const user = useSelector(state => state.session.user);
    const history = useNavigate();
    return (
        <div className="profileDropdown">
            <button
                className="profile-dropdown-button"
                onClick={() => {
                    setShowDropdown(false);
                    history.push(`/profile/${user.id}/`);
                }}>
                Profile
            </button>
            <LogoutButton />
        </div>
    );
}

export default Dropdown;
