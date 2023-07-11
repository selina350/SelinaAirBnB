import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview } from "../store/reviews";

function ReviewSummary({ review, showAction }) {
  const reviewId = review.id;
  const spotId = review.spotId;
  const userId = useSelector((state) => state.session.user.id); //loggedInUser
  const ownerId = useSelector((state) => state.spots.spots[spotId].ownerId); //spotOwner
  const date = new Date(review.updatedAt);
  const year = date.getFullYear();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[date.getMonth()];

  //delete review
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(deleteReview(spotId, reviewId));
  };

  return (
    <div className="review-summary">
      <div className="review-firstName">{review.User.firstName}</div>

      <div className="review-time">
        {month} {year}
      </div>
      <div className="review-review">{review.review}</div>
      {userId === review.userId && (
        <button onClick={handleDelete}>Delete</button>
      )}
    </div>
  );
}

export default ReviewSummary;
