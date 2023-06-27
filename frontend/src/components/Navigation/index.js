import React, { useState } from "react";

import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation(isLoaded) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const isLoggedIn = Object.keys(sessionUser).length;

  let sessionLinks;
  if (isLoaded && isLoggedIn) {
    sessionLinks = (
      <div className="NavBar-right-container">
        <ProfileButton user={sessionUser} />
      </div>
    );
  } else {
    sessionLinks = (
      <div className="NavBar-right-container">
        <NavLink to="/login">
          <button className="primary">Log In</button>
        </NavLink>

        <NavLink to="/signup">
          <button className="accent">Sign Up</button>
        </NavLink>
      </div>
    );
  }

  return (
    <div className="NavBar">
      <div className="NavBar-left-container">
        <NavLink exact to="/">
          <i className="fa-solid fa-house" />
        </NavLink>
      </div>
      <div className="NavBar-mid-container"></div>
      {sessionLinks}
    </div>
  );
}

export default Navigation;
