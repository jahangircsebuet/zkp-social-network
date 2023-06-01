import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../../store/session";
import LoginForm from "../../auth/LoginForm";
import SignUpForm from "../../auth/SignUpForm";
import { Modal } from "../../Modal";
import "./login.css";

function LogInPage() {
    const [showSignUp, setShowSignUp] = useState(false);
    const dispatch = useDispatch();

    const demoLogin = e => {
        e.preventDefault();

        dispatch(login("demo@demo.com", "password"));
    };
    return (
        <>
            {showSignUp && (
                <Modal onClose={() => setShowSignUp(false)}>
                    <SignUpForm />
                </Modal>
            )}
            <div id="login-page">
                <div id="login-content">
                    <div id="login-blurb">
                        <h1>bookface</h1>
                        <p>Connect with friends and the world around you on Bookface.</p>
                        <button className="green-button" onClick={demoLogin}>
                            Demo Login
                        </button>
                    </div>
                    <div id="login-container">
                        <LoginForm />
                        <button className="green-button" onClick={() => setShowSignUp(true)}>
                            Create new account
                        </button>
                    </div>
                </div>
                <div id="login-footer">
                    <h1>Patrick McPherson</h1>
                    <div id="gitlinked">
                        <a href="https://github.com/Patricus" target="_blank" rel="noreferrer">
                            Git Hub
                        </a>
                        <a
                            href="https://www.linkedin.com/in/patrick-mcpherson-438385117/"
                            target="_blank"
                            rel="noreferrer">
                            Linked In
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LogInPage;
