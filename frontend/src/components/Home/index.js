import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

function Home() {
    const dispatch = useDispatch()
  return (
    <>
      <button
        onClick={() => {
          dispatch(sessionActions.logOutUser());
        }}
      >
        Log Out
      </button>
    </>
  );
}

export default Home;
