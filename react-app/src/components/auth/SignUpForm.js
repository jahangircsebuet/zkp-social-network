import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";

const SignUpForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [reEmail, setReEmail] = useState("");
    const [bDay, setBDay] = useState(new Date().getDate());
    const [bMonth, setBMonth] = useState(new Date().getMonth());
    const [bYear, setBYear] = useState(new Date().getFullYear());
    const [birthday, setBirthday] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState([]);
    const [firstNameErrors, setFirstNameErrors] = useState([]);
    const [lastNameErrors, setLastNameErrors] = useState([]);
    const [emailErrors, setEmailErrors] = useState([]);
    const [reEmailErrors, setReEmailErrors] = useState([]);
    const [birthdayErrors, setBirthdayErrors] = useState([]);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [confirmPasswordErrors, setConfirmPasswordErrors] = useState([]);

    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    useEffect(() => {
        setBirthday(new Date(`${bYear} ${+bMonth + 1} ${bDay}`));
    }, [setBirthday, bDay, bMonth, bYear]);

    const onSignUp = async e => {
        e.preventDefault();
        setErrors([]);

        const data = await dispatch(
            signUp(firstName, lastName, email, reEmail, password, confirmPassword, birthday)
        );
        if (data) {
            setErrors(data);
        }
    };

    useEffect(() => {
        const firstNameErrs = [];
        const lastNameErrs = [];
        const emailErrs = [];
        const reEmailErrs = [];
        const birthdayErrs = [];
        const passwordErrs = [];
        const confirmPasswordErrs = [];

        errors.forEach(error => {
            error = error.split(":");
            if (error[0] === "firstName") firstNameErrs.push(error[1]);
            if (error[0] === "lastName") lastNameErrs.push(error[1]);
            if (error[0] === "email") emailErrs.push(error[1]);
            if (error[0] === "reEmail") reEmailErrs.push(error[1]);
            if (error[0] === "birthday") birthdayErrs.push(error[1]);
            if (error[0] === "password") passwordErrs.push(error[1]);
            if (error[0] === "confirmPassword") confirmPasswordErrs.push(error[1]);
        });

        setFirstNameErrors(firstNameErrs);
        setLastNameErrors(lastNameErrs);
        setEmailErrors(emailErrs);
        setReEmailErrors(reEmailErrs);
        setBirthdayErrors(birthdayErrs);
        setConfirmPasswordErrors(confirmPasswordErrs);
        setPasswordErrors(passwordErrs);
    }, [errors]);

    return (
        <>
            {!user && (
                <>
                    <div id="signup-text">
                        <h2>Sign Up</h2>
                        It's quick and easy.
                    </div>
                    <form onSubmit={onSignUp} id="signup-form">
                        {firstNameErrors.length > 0 && (
                            <div className="errors">
                                <div className="error">{firstNameErrors}</div>
                            </div>
                        )}
                        <div id="name-input">
                            <div className="required"></div>
                            <input
                                style={{ marginRight: "10px" }}
                                type="text"
                                name="firstname"
                                onChange={e => setFirstName(e.target.value)}
                                value={firstName}
                                placeholder="First name"></input>
                            {lastNameErrors.length > 0 && (
                                <div className="last-name-errors">
                                    <div className="last-name-error">{lastNameErrors}</div>
                                </div>
                            )}
                            <div className="required"></div>
                            <input
                                type="text"
                                name="lastname"
                                onChange={e => setLastName(e.target.value)}
                                value={lastName}
                                placeholder="Last name"></input>
                        </div>
                        {emailErrors.length > 0 && (
                            <div className="errors">
                                <div className="error">{emailErrors}</div>
                            </div>
                        )}
                        <div className="required"></div>
                        <input
                            type="email"
                            name="email"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            placeholder="email"></input>
                        {reEmailErrors.length > 0 && (
                            <div className="errors">
                                <div className="error">{reEmailErrors}</div>
                            </div>
                        )}
                        <div className="required"></div>
                        <input
                            type="email"
                            name="re-email"
                            onChange={e => setReEmail(e.target.value)}
                            value={reEmail}
                            placeholder="Re-enter email"></input>
                        {passwordErrors.length > 0 && (
                            <div className="errors">
                                <div className="error">{passwordErrors}</div>
                            </div>
                        )}
                        <div className="required"></div>
                        <input
                            type="password"
                            name="password"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            placeholder="New password"></input>
                        {confirmPasswordErrors.length > 0 && (
                            <div className="errors">
                                <div className="error">{confirmPasswordErrors}</div>
                            </div>
                        )}
                        <div className="required"></div>
                        <input
                            type="password"
                            name="confirmPassword"
                            onChange={e => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            placeholder="Confirm password"></input>
                        {birthdayErrors.length > 0 && (
                            <div className="errors">
                                <div className="error">{birthdayErrors}</div>
                            </div>
                        )}
                        <div className="required"></div>
                        <label>Birthday</label>
                        <div id="birthday-input">
                            <select
                                name="month"
                                onChange={e => setBMonth(e.target.value)}
                                value={bMonth}>
                                <option value={0}>Jan</option>
                                <option value={1}>Feb</option>
                                <option value={2}>Mar</option>
                                <option value={3}>Apr</option>
                                <option value={4}>May</option>
                                <option value={5}>Jun</option>
                                <option value={6}>Jul</option>
                                <option value={7}>Aug</option>
                                <option value={8}>Sep</option>
                                <option value={9}>Oct</option>
                                <option value={10}>Nov</option>
                                <option value={11}>Dec</option>
                            </select>
                            <select name="day" onChange={e => setBDay(e.target.value)} value={bDay}>
                                {[...Array(31).keys()].map(day => (
                                    <option key={day}>{day + 1}</option>
                                ))}
                            </select>
                            <select
                                name="year"
                                onChange={e => setBYear(e.target.value)}
                                value={bYear}>
                                {[...Array(100).keys()].map(year => (
                                    <option key={year}>{2022 - year}</option>
                                ))}
                            </select>
                        </div>
                        <small style={{ position: "relative", marginTop: "5px", color: "#919191" }}>
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
                        <button className="green-button" type="submit">
                            Sign Up
                        </button>
                    </form>
                </>
            )}
        </>
    );
};

export default SignUpForm;
