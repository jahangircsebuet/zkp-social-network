import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUsers } from "../../store/users";

function Searchbar() {
    const [input, setInput] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    const users = Object.values(useSelector(state => state.users));
    const sent = Object.values(useSelector(state => state.requests.sent));
    const received = Object.values(useSelector(state => state.requests.received));
    const friends = Object.values(useSelector(state => state.friends));

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    const filterUsers = e => {
        const inputValue = e.target.value;
        setInput(inputValue);
        if (inputValue.length > 1) {
            setFilteredUsers(
                friends
                    .filter(user => {
                        return `${user.first_name} ${user.last_name}`.match(
                            new RegExp(inputValue, "i")
                        );
                    })
                    .concat(
                        received.filter(user => {
                            return `${user.first_name} ${user.last_name}`.match(
                                new RegExp(inputValue, "i")
                            );
                        })
                    )
                    .concat(
                        sent.filter(user => {
                            return `${user.first_name} ${user.last_name}`.match(
                                new RegExp(inputValue, "i")
                            );
                        })
                    )
                    .concat(
                        users.filter(user => {
                            return `${user.first_name} ${user.last_name}`.match(
                                new RegExp(inputValue, "i")
                            );
                        })
                    )
                    .slice(0, 10)
            );
        } else setFilteredUsers([]);
    };

    const searchClear = () => {
        setInput("");
        setFilteredUsers([]);
        document.querySelector(".searchInput > input").focus();
    };

    return (
        <div className="searchbar">
            <div className="searchInput">
                <input
                    placeholder="Search Users"
                    type="text"
                    value={input}
                    onChange={filterUsers}
                />
                {input.length ? (
                    <i className="fa-solid fa-xmark searchIcon" onClick={searchClear}></i>
                ) : (
                    <i
                        className="fa-solid fa-magnifying-glass searchIcon"
                        onClick={() => document.querySelector(".searchInput > input").focus()}></i>
                )}
            </div>
            <div className="searchDropdown">
                {filteredUsers.length > 0 &&
                    filteredUsers.map(user => {
                        return (
                            <Link
                                onClick={() => {
                                    setFilteredUsers([]);
                                    setInput("");
                                }}
                                key={user.id}
                                className="profileSearch"
                                to={`/profile/${user.id}`}>{`${user.first_name} ${user.last_name}`}</Link>
                        );
                    })}
            </div>
        </div>
    );
}

export default Searchbar;
