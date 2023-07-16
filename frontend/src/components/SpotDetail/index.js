import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOneSpot } from "../../store/spots";

import { useParams } from "react-router-dom";
import "./SpotDetail.css";
import ReviewList from "../ReviewList";
function SpotDetail() {
  const { id } = useParams();
  const spot = useSelector((state) => state.spots.spots[id]);
  const reviews = useSelector((state) => state.reviews.reviews);
  const numOfReviews = Object.values(reviews).length;
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOneSpot(id)).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch, id]);

  if (isLoaded) {
    let previewImage = spot.SpotImages.find((img) => img.preview);
    let otherImages = spot.SpotImages.filter((img) => img !== previewImage);
    return (
      <div className="spot-detail">
        <div>
          <h1>{spot.name}</h1>
          {spot.city}, {spot.state},{spot.country}
        </div>

        <div className="spot-detail-img-container">
          <div className="preview-img">
            <img src={previewImage && previewImage.url} alt="previewImage" />
          </div>
          <div className="other-img">
            {otherImages.map((img) => {
              return <img src={img.url} alt="otherImage" />;
            })}
          </div>
        </div>
        <div className="spot-detail-info-container">
          <div className="spot-detail-description">
            <div>
              Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
            </div>
            <div>{spot.description}</div>
          </div>
          <div className="spot-detail-reservation">
            <div>${spot.price} night</div>
            {spot.avgRating && (
              <div>
                <i className="fa-solid fa-star"></i> {spot.avgRating} {"• "}
                {numOfReviews}
                {numOfReviews > 1 ? " Reviews" : " Review"}
              </div>
            )}
            {spot.avgRating === null ? (
              <div>
                <i className="review fa-solid fa-star"></i> New
              </div>
            ) : null}
            <button className="primary" onClick={()=>{alert("feature comming soon.")}}>Reserve</button>
          </div>
        </div>

        <ReviewList />
      </div>
    );
  } else {
    return <div>loading</div>;
  }
}

export default SpotDetail;
