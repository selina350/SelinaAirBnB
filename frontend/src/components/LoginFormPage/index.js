import React, { useState } from "react";

import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import "./LoginForm.css";
import Modal from "../Modal";

function LoginFormPage({ onClose, onSignupClick }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (Object.keys(sessionUser).length > 0) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    dispatch(sessionActions.logInUser({ credential, password })).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  return (
    <>
      <Modal title="Log In" onClose={onClose}>
        <form className="Login-form" onSubmit={handleSubmit}>
          <input
            placeholder="Username or Email"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.credential && <p>{errors.credential}</p>}
          <button
            className="primary"
            type="submit"
            disabled={credential.length < 3 || password.length < 6}
            onClick={handleSubmit}
          >
            Log In
          </button>
        </form>
        <h3>Doesn't have an account?</h3>
        <button className="Login-signup-link" onClick={onSignupClick}>
          Sign Up
        </button>
      </Modal>
    </>
  );
}

export default LoginFormPage;
