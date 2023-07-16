import React, { useState } from "react";

import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";

import "./Navigation.css";
import logo from "../../images/Airbnb-logo.png";
import LoginFormPage from "../LoginFormPage";
import SignupFormPage from "../SignupFormPage";

function Navigation(isLoaded) {
  const sessionUser = useSelector((state) => state.session.user);
  const isLoggedIn = Object.keys(sessionUser).length > 0;
  const [logInModalOpen, setLogInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const handleLogIn = () => {
    setShowMenu(false);
    setLogInModalOpen(true);
  };
  const handleSignUp = () => {
    setShowMenu(false);
    setSignUpModalOpen(true);
  };
  const buttonClassName = "primary " + (showMenu ? "" : " hidden");
  return (
    <div className="NavBar">
      <div className="NavBar-left-container">
        <NavLink exact to="/">
          <img className="logo" src={logo}></img>
        </NavLink>
      </div>
      <div className="NavBar-mid-container"></div>

      <div className="NavBar-right-container">
        {isLoaded && isLoggedIn && (
          <NavLink to="/spots/create">
            <button>Create a New Spot</button>
          </NavLink>
        )}
        <ProfileButton
          user={sessionUser}
          isLoaded={isLoaded}
          isLoggedIn={isLoggedIn}
          handleLogIn={handleLogIn}
          handleSignUp={handleSignUp}
        />
      </div>
      {logInModalOpen && (
        <LoginFormPage
          onSignupClick={() => {
            setLogInModalOpen(false);
            setSignUpModalOpen(true);
          }}
          onClose={() => setLogInModalOpen(false)}
        />
      )}
      {signUpModalOpen && (
        <SignupFormPage
          onLogInClick={() => {
            setSignUpModalOpen(false);
            setLogInModalOpen(true);
          }}
          onClose={() => setSignUpModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Navigation;
