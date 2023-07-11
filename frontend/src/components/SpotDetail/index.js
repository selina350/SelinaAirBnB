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
  }, [dispatch]);

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
            <img
              src={previewImage && previewImage.url}
              // src="https://a0.muscache.com/im/pictures/c36ddec0-9a59-4174-a615-ea79820e601e.jpg?im_w=720"
            />
          </div>
          <div className="other-img">
            {otherImages.map((img) => {
              return (
                <img
                  src={img.url}
                  // src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-621011150851342342/original/d556f698-e98b-4f71-b7a3-4a2d66eb04d4.jpeg?im_w=720"
                />
              );
            })}
          </div>
        </div>
        <div>
          <div>
            Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
          </div>
          <div>{spot.description}</div>
        </div>
        <div>
          <div>${spot.price}</div>
          {spot.avgRating && (
            <div>
              <i className="fa-solid fa-star"></i> {spot.avgRating} {"• "}
              {numOfReviews}
              {numOfReviews > 1 ? " Reviews" : " Review"}
            </div>
          )}
          {spot.avgRating === null ? <div><i className="fa-solid fa-star"></i> New</div> : null}
          <button className="primary">Reserve</button>
        </div>
        <ReviewList />
      </div>
    );
  } else {
    return <div>loading</div>;
  }
}

export default SpotDetail;
