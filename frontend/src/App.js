import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";
import SignupFormPage from "./components/SignupFormPage";
import SpotList from "./components/SpotList";
import CreateNewSpot from "./components/CreateNewSpot";
import SpotDetail from "./components/SpotDetail";
import ManageSpots from "./components/ManageSpots";
import EditSpot from "./components/EditSpot";
import Footer from "./components/Footer"
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    isLoaded && (
      <div>
        <Navigation isLoaded={isLoaded} />

        <Switch>
        <Route exact path="/">
            <SpotList />
          </Route>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/spots/create">
            <CreateNewSpot />
          </Route>
          <Route path="/spots/:id/edit">
            <EditSpot />
          </Route>
          <Route path="/spots/:id">
            <SpotDetail />

          </Route>
          <Route path="/users/me/spots">
            <ManageSpots />
          </Route>

        </Switch>
        <Footer />
      </div>
    )
  );
}

export default App;
