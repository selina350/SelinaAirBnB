import { useEffect, useState } from "react";
import ReviewSummary from "./ReviewSummary";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as reviewAction from "../store/reviews";
import * as spotAction from "../store/spots";
import Modal from "./Modal";
import "./ReviewList.css";
import { starToDecimal } from "../utils/spotHelper";
function ReviewList() {
  const { id } = useParams();
  const spot = useSelector((state) => state.spots.spots[id]);
  const allReviews = useSelector((state) => state.reviews.reviews);
  const numOfReviews = Object.values(allReviews).length;
  const userId = useSelector((state) => state.session.user.id); //loggedInUser
  const ownerId = useSelector((state) => state.spots.spots[id].ownerId); //spotOwner
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [stars, setStars] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  let review;
  if (isLoaded) {
    review = Object.values(allReviews).find(
      (review) => review.userId === userId
    );
  }
  //check validation error
  useEffect(() => {
    const errors = {};
    if (reviewMessage === undefined || reviewMessage.length < 10) {
      errors.message = "message shoule be at least 10 characters.";
    }
    if (stars === undefined || stars < 1 || stars > 5) {
      errors.stars = "stars range from 1 to 5.";
    }

    setValidationErrors(errors);
  }, [reviewMessage, stars]);

  //confirm spot is loaded
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(reviewAction.getAllReviews(id)).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch, id]);

  //open review form
  const handlePost = () => {
    setConfirmModalOpen(true);
  };
  //close review form
  const handleOnClose = () => {
    setConfirmModalOpen(false);
  };

  //create review
  const handleSubmit = () => {
    if (Object.values(validationErrors).length > 0) {
      return;
    }
    dispatch(reviewAction.createReview(id, reviewMessage, stars))
      .then(() => {
        return dispatch(spotAction.getOneSpot(id));
      })
      .then(() => {
        setConfirmModalOpen(false);
      })
      .catch(async (res) => {
        const errorMsg = await res.json();
        if (errorMsg) {
          setValidationErrors({ ...validationErrors, backEndErr: errorMsg });
        }
      });
  };

  if (isLoaded) {
    return (
      <div className="reviews-list-container">
        <hr />
        {spot.avgRating && (
          <div>
            <i className="review fa-solid fa-star "></i> {starToDecimal(spot.avgRating)} {"• "}
            {numOfReviews}
            {numOfReviews > 1 ? " Reviews" : " Review"}
          </div>
        )}
        {spot.avgRating === null ? (
          <div>
            <i className="fa-solid fa-star"></i> New
          </div>
        ) : null}
        {!review && userId && userId !== ownerId && (
          <button onClick={handlePost}>Post Your Review</button>
        )}
        <div className="reviews-list">
          <div>
            {userId &&
              Object.values(allReviews).length === 0 &&
              userId !== ownerId &&
              "Be the first one to leave a post!"}
          </div>
          <div>
            {Object.values(allReviews).sort((reviewA,reviewB)=>{
              if(reviewA.createdAt < reviewB.createdAt){
                return 1
              }else{
                return -1
              }
            }).map((review, i) => (
              <div className="reviews-list-spot" key={i}>
                <ReviewSummary review={review} />
              </div>
            ))}
          </div>
        </div>
        {confirmModalOpen && (
          <Modal title="How was your stay?" onClose={handleOnClose}>
            <div>
              {Object.values(validationErrors)}
              <textarea
                placeholder="Leave your review here..."
                type="text"
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
                required
              />
              <div className="stars">
                <i
                  className={
                    stars > 0 ? `fa-solid fa-star` : `fa-regular fa-star `
                  }
                  onClick={() => {
                    setStars(1);
                  }}
                ></i>
                <i
                  className={
                    stars > 1 ? `fa-solid fa-star` : `fa-regular fa-star `
                  }
                  onClick={() => {
                    setStars(2);
                  }}
                ></i>
                <i
                  className={
                    stars > 2 ? `fa-solid fa-star` : `fa-regular fa-star `
                  }
                  onClick={() => {
                    setStars(3);
                  }}
                ></i>
                <i
                  className={
                    stars > 3 ? `fa-solid fa-star` : `fa-regular fa-star `
                  }
                  onClick={() => {
                    setStars(4);
                  }}
                ></i>
                <i
                  className={
                    stars > 4 ? `fa-solid fa-star` : `fa-regular fa-star `
                  }
                  onClick={() => {
                    setStars(5);
                  }}
                ></i>
                &nbsp;Stars
              </div>
              <button
              className="primary"
                disabled={Object.values(validationErrors).length > 0}
                onClick={handleSubmit}
              >
                Submit Your Review
              </button>
            </div>
          </Modal>
        )}
      </div>
    );
  } else {
    return <div>loading</div>;
  }
}

export default ReviewList;
