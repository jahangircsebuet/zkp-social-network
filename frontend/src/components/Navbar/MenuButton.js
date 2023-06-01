import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Dropdown from "./Dropdown";
import defaultProfilePic from "../images/default-profile.png";

function MenuButton() {
    const [profilePic, setProfilePic] = useState(defaultProfilePic);
    const [showDropdown, setShowDropdown] = useState(false);

    const user = useSelector(state => state.session.user);

    useEffect(() => {
        const clickCheck = e => {
            if (
                e.target.id === "user-menu-pic" ||
                e.target.classList.contains("profile-dropdown-button")
            )
                return;
            if (!e.target.classList.contains("profileDropdown")) setShowDropdown(false);
        };
        document.addEventListener("mousedown", clickCheck);
        return () => document.removeEventListener("mousedown", clickCheck);
    }, [showDropdown]);

    useEffect(() => {
        if (user.profile_pic) setProfilePic(user.profile_pic);
    }, [user]);

    return (
        <div style={{ position: "relative" }}>
            {user && (
                <button
                    id="user-menu-button"
                    onClick={() => {
                        setShowDropdown(!showDropdown);
                    }}>
                    <img
                        id="user-menu-pic"
                        src={profilePic}
                        onError={() => setProfilePic(defaultProfilePic)}
                        alt="User Menu"
                    />
                </button>
            )}
            {showDropdown && <Dropdown setShowDropdown={setShowDropdown} />}
        </div>
    );
}

export default MenuButton;
