import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { Link, useHistory } from "react-router-dom";
import "./ProfileButton.css";

function ProfileButton({
  user,
  isLoaded,
  isLoggedIn,
  handleLogIn,
  handleSignUp,
}) {
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

  const history = useHistory();
  const logout = (e) => {
    e.preventDefault();
    setShowMenu(false);
    dispatch(sessionActions.logOutUser()).then(() => history.push(`/`));
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="Profile-container" ref={ulRef}>
      <button onClick={() => setShowMenu(true)}>
        <i className="fa-solid fa-bars" />
        &nbsp;
        <i className="fas fa-user-circle" />
      </button>
      <div className="Profile-dropdown-container">
        <ul className={ulClassName}>
          {isLoaded && !isLoggedIn && (
            <div>
              <button className="primary" onClick={() => handleLogIn()}>
                Log In
              </button>
              <button className="primary" onClick={() => handleSignUp()}>
                Sign Up
              </button>
            </div>
          )}
          {isLoaded && isLoggedIn && (
            <div>
              <li>Hello!{user.firstName}</li>
              <li>{user.email}</li>
              <Link to="/users/me/spots" onClick={() => setShowMenu(false)}>
                Manage Spots
              </Link>
              <li>
                <button className="accent" onClick={logout}>
                  Log Out
                </button>
              </li>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ProfileButton;
