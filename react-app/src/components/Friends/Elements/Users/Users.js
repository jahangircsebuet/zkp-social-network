import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../../../store/users";
import UserCard from "./UserCard";

function Users() {
    const users = useSelector(state => state.users);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    return (
        <div className="cardContainer">
            {users && Object.values(users).map(user => <UserCard key={user.id} friend={user} />)}
        </div>
    );
}

export default Users;
