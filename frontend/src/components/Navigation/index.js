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
      <li>
        <ProfileButton user={sessionUser} />

      </li>
    );
  } else {
    sessionLinks = (
      <li>
        <NavLink to="/login">Log In</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </li>
    );
  }

  return (
    <ul>
      <li>
        <NavLink exact to="/">
        <i className="fa-solid fa-house"></i>

        </NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
