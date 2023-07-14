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
  const isLoggedIn = Object.keys(sessionUser).length;
  const [logInModalOpen, setLogInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  let sessionLinks;
  function handleLogIn() {
    setLogInModalOpen(true);
  }
  const handleSignUp = () => {
    setSignUpModalOpen(true);
  };
  if (isLoaded && isLoggedIn) {
    sessionLinks = (
      <div className="NavBar-right-container">
        <NavLink to="/spots/create">
          <button>Create a New Spot</button>
        </NavLink>
        <ProfileButton user={sessionUser} />
      </div>
    );
  } else {
    sessionLinks = (
      <div className="NavBar-right-container">
        <button className="primary" onClick={handleLogIn}>
          Log In
        </button>
        <button className="accent" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="NavBar">
      <div className="NavBar-left-container">
        <NavLink exact to="/">
          <img className="logo" src={logo}></img>
        </NavLink>
      </div>
      <div className="NavBar-mid-container"></div>
      {sessionLinks}
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
