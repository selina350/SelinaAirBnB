import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import {Link} from "react-router-dom"
import "./ProfileButton.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  useEffect(() => {
    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const openMenu = () => {
    setShowMenu(true);
  };

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logOutUser());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="Profile-container" ref={ulRef}>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <div className="Profile-dropdown-container">
        <ul className={ulClassName}>
          <li>{user.username}</li>
          <li>
            {user.firstName} {user.lastName}
          </li>
          <li>{user.email}</li>
          <Link to="/users/me/spots" onClick={()=>(setShowMenu(false))}>Manage Spots</Link>
          <li>
            <button className="accent" onClick={logout}>
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ProfileButton;
