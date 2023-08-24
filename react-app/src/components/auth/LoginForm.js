import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { Redirect } from "react-router-dom";
import { login } from "../../store/session";
import "../Home/Pages/login.css";

const LoginForm = () => {
    const [errors, setErrors] = useState([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailErrors, setEmailErrors] = useState([]);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const onLogin = async e => {
        e.preventDefault();

        const data = await dispatch(login(email, password));
        if (data) {
            setErrors(data);
        }
    };

    useEffect(() => {
        const emailErrs = [];
        const passwordErrs = [];
        errors.forEach(error => {
            error = error.split(":");
            if (error[0] === "email") emailErrs.push(error[1]);
            if (error[0] === "password") passwordErrs.push(error[1]);
        });
        setEmailErrors(emailErrs);
        setPasswordErrors(passwordErrs);
    }, [errors]);

    return (
        <>
            {!user && (
                <form onSubmit={onLogin} id="login-form">
                    {emailErrors.length > 0 && (
                        <div className="errors">
                            <div className="error">{emailErrors}</div>
                        </div>
                    )}
                    <div className="required"></div>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                        }}
                    />
                    {passwordErrors.length > 0 && (
                        <div className="errors">
                            <div className="error">{passwordErrors}</div>
                        </div>
                    )}
                    <div className="required"></div>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value);
                        }}
                    />
                    <small style={{ position: "relative", marginBottom: "5px", color: "#919191" }}>
                        <strong
                            style={{
                                fontSize: "24px",
                                color: "red",
                                position: "absolute",
                                left: "-14px",
                                top: "-4px",
                            }}>
                            *
                        </strong>
                        Required
                    </small>
                    <button id="login-button" type="submit">
                        Log In
                    </button>
                </form>
            )}
        </>
    );
};

export default LoginForm;
