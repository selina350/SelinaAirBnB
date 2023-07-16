import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview } from "../store/reviews";
import Modal from "./Modal";
import "./ReviewSummary.css"
function ReviewSummary({ review, showAction }) {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const reviewId = review.id;
  const spotId = review.spotId;
  const userId = useSelector((state) => state.session.user.id); //loggedInUser
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
    setConfirmModalOpen(false)
  };

  return (
    <div className="review-summary">
      <div className="review-firstName">{review.User.firstName}</div>

      <div className="review-time">
        {month} {year}
      </div>
      <div className="review-review">{review.review}</div>
      {userId === review.userId && (
        <button onClick={() => setConfirmModalOpen(true)}>Delete</button>
      )}

      {confirmModalOpen && (
        <Modal title="Confirm Delete">
          <div>
            <h3>Are you sure to delete this review? </h3>
            <button className="primary" onClick={handleDelete}>Yes</button>
            <button

              onClick={() => setConfirmModalOpen(false)}
            >
              No
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ReviewSummary;
