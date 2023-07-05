import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserSpots } from "../../store/spots";
import SpotSummary from "../SpotSummary";

function ManageSpots() {
  const allSpots = useSelector((state) => state.spots.spots);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserSpots());
  }, [dispatch]);
  return (
    <div className="spots-list">
      <h1>Manage Your Spots</h1>
      <div className="spots-list-container">
        {Object.values(allSpots).map((spot) => (
          <div className="spots-list-spot">
            <SpotSummary spot={spot} showAction={true}/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSpots;
