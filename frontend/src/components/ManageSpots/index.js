import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserSpots } from "../../store/spots";
import SpotSummary from "../SpotSummary";
import { useHistory } from "react-router-dom";

function ManageSpots() {
  const allSpots = useSelector((state) => state.spots.spots);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserSpots());
  }, [dispatch]);
  const history = useHistory()
  const handleCreateSpot = (e)=>{
    e.preventDefault();
    history.push("/spots/create")
  }
  return (
    <div className="spots-list">
      <h1>Manage Your Spots</h1>
      <div className="spots-list-container">
        {Object.values(allSpots).length=== 0 && <button onClick={handleCreateSpot}>Create New Spot</button>}
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
