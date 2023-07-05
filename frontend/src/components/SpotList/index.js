import React, {useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";
import SpotSummary from "../SpotSummary";
import "./Spots.css";
function SpotList() {
  const allSpots = useSelector((state) => state.spots.spots);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);
  return (
    <div className="spots-list">
      <div className="spots-list-container">
        {Object.values(allSpots).map((spot) => (
          <div className="spots-list-spot">
            <SpotSummary spot={spot} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpotList;
