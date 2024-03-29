import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./signupForm.css";
import Modal from "../Modal";
function SignupFormPage({ onClose, onLogInClick }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser && Object.keys(sessionUser).length > 0)
    return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signUpUser({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <Modal title="Sign Up" onClose={onClose}>
      <form className="Signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="error">{errors.email && errors.email}</div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className="error">{errors.username && errors.username}</div>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <div className="error">{errors.firstName && errors.firstName}</div>
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <div className="error">{errors.lastName && errors.lastName}</div>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="error">{errors.password && errors.password}</div>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className="error">
          {errors.confirmPassword && errors.confirmPassword}
        </div>
        <button
          type="submit"
          className="primary"
          disabled={
            email.length === 0 ||
            username.length < 4 ||
            firstName.length === 0 ||
            lastName.length === 0 ||
            password.length < 6 ||
            confirmPassword.length < 6
          }
        >
          Sign Up
        </button>
      </form>
      <h3>Already have an account?</h3>
      <button className="Login-signup-link" onClick={onLogInClick}>
        Log In
      </button>
    </Modal>
  );
}

export default SignupFormPage;
