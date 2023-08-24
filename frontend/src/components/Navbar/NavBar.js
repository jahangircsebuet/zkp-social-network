import React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import MenuButton from "./MenuButton";
import B from "../images/B.png";
import "./navbar.css";
import Searchbar from "./Searchbar";

const NavBar = () => {
    const user = useSelector(state => state.session.user);

    return (
        <>
            {user && (
                <nav id="navbar">
                    <div>
                        <Link to="/">
                            <div id="logo">
                                <img src={B} alt="Logo" />
                            </div>
                        </Link>
                        <Searchbar />
                    </div>
                    <div id="nav-buttons">
                        <NavLink
                            to="/"
                            exact={true}
                            id="home-link"
                            className="navlink"
                            activeClassName="activeNav">
                            <div className="nav-button"></div>
                        </NavLink>
                        <NavLink
                            to="/friends"
                            id="friend-link"
                            className="navlink"
                            activeClassName="activeNav">
                            <div className="nav-button"></div>
                        </NavLink>
                        <span to="///" id="" className="empty-navlink" activeclassname="activeNav">
                            <div className="nav-button"></div>
                        </span>
                        <span to="///" id="" className="empty-navlink" activeclassname="activeNav">
                            <div className="nav-button"></div>
                        </span>
                        <NavLink
                            to="/contact"
                            exact={true}
                            id="contact-link"
                            className="navlink"
                            activeClassName="activeNav">
                            <div className="nav-button"></div>
                        </NavLink>
                    </div>
                    <div id="menu-button">
                        <MenuButton />
                    </div>
                </nav>
            )}
        </>
    );
};

export default NavBar;
