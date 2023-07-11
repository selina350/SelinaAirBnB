import { csrfFetch } from "./csrf";

export const GET_ALL_REVIEWS = "GET_ALL_REVIEWS";
export const GET_ONE_REVIEW = "GET_ONE_REVIEW";
export const CREATE_REVIEW = "POST_REVIEW";
export const DELETE_REVIEW = "DELETE_REVIEW";

export const getAllReviews = (id) => async (dispatch) => {
  //id is spotId
  const url = `/api/spots/${id}/reviews`;

  const response = await csrfFetch(url);
  const data = await response.json();
  const reviews = data.Reviews;

  dispatch({ type: GET_ALL_REVIEWS, reviews });
};

//create review
export const createReview =
  (id, review, stars) => async (dispatch, getState) => {
    const url = `/api/spots/${id}/reviews`;
    const payload = {
      review,
      stars,
    };
    const response = await csrfFetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const reviewData = await response.json();
    const userData = getState().session.user;
    reviewData.User = userData;


    dispatch({
      type: CREATE_REVIEW,
      review: { ...reviewData },
    });
    return id;
  };

  //delete one review
export const deleteReview = (spotId, reviewId) => async (dispatch) => {
  const url = `/api/spots/${spotId}/reviews/${reviewId}`;

  const response = await csrfFetch(url, {
    method:"DELETE"
  });
  const message = await response.json();

  dispatch({ type: DELETE_REVIEW, reviewId});
};

const initialState = { reviews: {} };

const reviews = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case GET_ALL_REVIEWS:
      newState.reviews = {};
      action.reviews.forEach((review) => {
        newState.reviews[review.id] = review;
      });
      return newState;

    case GET_ONE_REVIEW:
      newState.reviews = {
        ...newState.reviews,
        [action.review.id]: action.review,
      };

      return newState;
    case CREATE_REVIEW:
      newState.reviews = { ...newState.reviews };
      newState.reviews[action.review.id] = action.review;
      return newState;
    case DELETE_REVIEW:
      newState.reviews = { ...newState.reviews };
      delete newState.reviews[action.reviewId];
      return newState;
    default:
      return state;
  }
};

export default reviews;
