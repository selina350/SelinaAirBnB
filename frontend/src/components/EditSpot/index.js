import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneSpot } from "../../store/spots";
import CreateNewSpot from "../CreateNewSpot";
function EditSpot() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const spots = useSelector((state) => state.spots.spots);
  const spot = spots[id];
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getOneSpot(id)).then(() => setIsLoaded(true));
  }, [dispatch]);
  return (
    <div>
      <div>{isLoaded && <CreateNewSpot spot={spot} />}</div>
      <div>{!isLoaded && "isLoading"}</div>
    </div>
  );
}

export default EditSpot;
