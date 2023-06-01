import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editUser } from "../../../store/session";
import { Modal } from "../../Modal";
import defaultProfile from "../../images/default-profile.png";
import "./editProfileForm.css";

// Form used to edit a post
function EditProfileForm({ profile, setShowEditProfile }) {
    const [bio, setBio] = useState(profile.bio || "");
    const [born_from, setBorn_from] = useState(profile.born_from);
    const [born_from_city, setBorn_from_city] = useState(
        profile.born_from ? profile.born_from.split(", ")[0] : ""
    );
    const [born_from_state, setBorn_from_state] = useState(
        profile.born_from ? profile.born_from.split(", ")[1] : ""
    );
    const [cover_pic, setCover_pic] = useState();
    const [previewCover_pic, setPreviewCover_pic] = useState(profile.cover_pic);
    const [profile_pic, setProfile_pic] = useState();
    const [previewProfile_pic, setPreviewProfile_pic] = useState(
        profile.profile_pic || defaultProfile
    );
    const [lives_in, setLives_in] = useState(profile.lives_in);
    const [lives_in_city, setLives_in_city] = useState(
        profile.lives_in ? profile.lives_in.split(", ")[0] : ""
    );
    const [lives_in_state, setLives_in_state] = useState(
        profile.lives_in ? profile.lives_in.split(", ")[1] : ""
    );
    const [bioErrors, setBioErrors] = useState(null);
    const [lives_in_errors, setLives_in_errors] = useState(null);
    const [born_from_errors, setBorn_from_errors] = useState(null);
    const [errors, setErrors] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        setBorn_from(`${born_from_city}, ${born_from_state}`);
    }, [setBorn_from, born_from_city, born_from_state]);

    useEffect(() => {
        setLives_in(`${lives_in_city}, ${lives_in_state}`);
    }, [setLives_in, lives_in_city, lives_in_state]);

    useEffect(() => {
        if (bio.length > 101) setBioErrors("Bio must be under 101 characters.");
        else setBioErrors(null);
    }, [bio]);

    useEffect(() => {
        if (lives_in_city && !lives_in_state) {
            setLives_in_errors("Please add a state.");
        }
        if (!lives_in_city && lives_in_state) {
            setLives_in_errors("Please add a city.");
        }
        if (lives_in_city && lives_in_state) {
            setLives_in_errors(null);
        }
        if (born_from_city && !born_from_state) {
            setBorn_from_errors("Please add a state.");
        }
        if (!born_from_city && born_from_state) {
            setBorn_from_errors("Please add a city.");
        }
        if (born_from_city && born_from_state) {
            setBorn_from_errors(null);
        }
    }, [born_from_city, born_from_state, lives_in_city, lives_in_state]);

    const submit = async e => {
        e.preventDefault();
        setErrors([]);

        if (lives_in_errors || born_from_errors) {
            return;
        }

        const data = await dispatch(editUser(bio, born_from, cover_pic, profile_pic, lives_in));

        if (data) {
            //     //Show errors
            setErrors(data);
            return;
        } else {
            //     //Close modal
            setShowEditProfile(false);
        }
    };

    const states = [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
    ];

    const updateProfilePic = pic => {
        setPreviewProfile_pic(URL.createObjectURL(pic.files[0]));
        setProfile_pic(pic.files[0]);
    };

    const updateCoverPic = pic => {
        setPreviewCover_pic(URL.createObjectURL(pic.files[0]));
        setCover_pic(pic.files[0]);
    };

    return (
        <Modal onClose={() => setShowEditProfile(false)}>
            <div id="profile-form">
                <h2>Edit profile</h2>
                <div>
                    {errors.map((error, ind) => (
                        <div key={ind}>{error}</div>
                    ))}
                </div>
                <form className="edit-profile-form" onSubmit={submit}>
                    <h3>Profile Picture</h3>
                    <div id="editProfileContainer">
                        <img
                            src={previewProfile_pic}
                            alt="profile"
                            onError={() => setPreviewProfile_pic(defaultProfile)}
                        />
                    </div>
                    <label className="custom-file-upload">
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={e => updateProfilePic(e.target)}
                        />
                        {profile_pic ? profile_pic.name : `Upload Profile Photo`}
                    </label>
                    <h3>Cover Photo</h3>
                    <div id="editCoverContainer">
                        {previewCover_pic && (
                            <img
                                src={previewCover_pic}
                                alt="cover"
                                onError={() => setPreviewCover_pic()}
                            />
                        )}
                    </div>
                    <label className="custom-file-upload">
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={e => updateCoverPic(e.target)}
                        />
                        {cover_pic ? cover_pic.name : `Upload Cover Photo`}
                    </label>
                    <h3>Bio</h3>
                    {bioErrors && (
                        <div className="profile-errors">
                            <div className="profile-error">{bioErrors}</div>
                        </div>
                    )}
                    <textarea
                        name="bio"
                        placeholder="Describe yourself..."
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                    />
                    <small>{`Bio character count ${bio.length}/101`}</small>
                    <h3>Customize your intro</h3>
                    <div className="profile-datefields">
                        <label>Lives in</label>
                        {lives_in_errors && (
                            <div className="profile-errors">
                                <div className="profile-error">{lives_in_errors}</div>
                            </div>
                        )}
                        <input
                            name="lives_in_city"
                            placeholder="What city do you live in?"
                            value={lives_in_city}
                            onChange={e => setLives_in_city(e.target.value)}
                        />
                        <select
                            className="state-select"
                            name="lives_in_state"
                            value={lives_in_state}
                            onChange={e => setLives_in_state(e.target.value)}>
                            <option hidden>Choose State</option>
                            {states.map(state => {
                                return <option key={state}>{state}</option>;
                            })}
                        </select>
                    </div>
                    <div className="profile-datefields">
                        <label>Born from</label>
                        {born_from_errors && (
                            <div className="profile-errors">
                                <div className="profile-error">{born_from_errors}</div>
                            </div>
                        )}
                        <input
                            name="born_from_city"
                            placeholder="What city do you live in?"
                            value={born_from_city}
                            onChange={e => setBorn_from_city(e.target.value)}
                        />
                        <select
                            className="state-select"
                            name="born_from_state"
                            value={born_from_state}
                            onChange={e => setBorn_from_state(e.target.value)}>
                            <option hidden>Choose State</option>
                            {states.map(state => {
                                return <option key={state}>{state}</option>;
                            })}
                        </select>
                    </div>
                    <button id="update-profile-button">Update profile</button>
                </form>
            </div>
        </Modal>
    );
}

export default EditProfileForm;
