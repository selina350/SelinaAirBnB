import { csrfFetch } from "./csrf";

export const GET_ALL_SPOTS = "GET_ALL_SPOTS";
export const CREATE_SPOT = "CREATE_SPOT";
export const EDIT_SPOT = "EDIT_SPOT";
export const GET_ONE_SPOT = "GET_ONE_SPOT";
export const DELETE_SPOT = "DELETE_SPOT";

export const getAllSpots = () => async (dispatch) => {
  const url = `/api/spots`;

  const response = await csrfFetch(url);
  const data = await response.json();
  const spots = data.Spots;

  dispatch({ type: GET_ALL_SPOTS, spots });
};
//get one spot
export const getOneSpot = (id) => async (dispatch) => {
  const url = `/api/spots/${id}`;

  const response = await csrfFetch(url);
  const spot = await response.json();

  dispatch({ type: GET_ONE_SPOT, spot });
};

//get all spots by the user
export const getUserSpots = () => async (dispatch) => {
  const url = `/api/users/me/spots`;

  const response = await csrfFetch(url);

  const spotsData = await response.json();
  const spots = spotsData.Spots;

  dispatch({ type: GET_ALL_SPOTS, spots });
};

//create spot
export const createSpot =
  (payload, previewImgUrl, otherImages) => async (dispatch) => {
    const spotUrl = `/api/spots`;

    const response = await csrfFetch(spotUrl, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const spotData = await response.json();
    const id = spotData.id;

    const imageUrl = `/api/spots/${id}/images`;
    // const imageResponse = await Promise.all(imageUrlArr.map( async imageUrl=>{
    //   await csrfFetch(imageUrl, {
    //     method: "POST",
    //     body: JSON.stringify(imageUrl),
    //   });

    //   const previewImageData = await response.json();
    // }))
    const imageResponse = await csrfFetch(imageUrl, {
      method: "POST",
      body: JSON.stringify({ preview: true, url: previewImgUrl }),
    });

    otherImages.forEach((image) => {
      if (image.length > 0) {
        csrfFetch(imageUrl, {
          method: "POST",
          body: JSON.stringify({ preview: false, url: image }),
        });
      }
    });

    dispatch({
      type: CREATE_SPOT,
      spot: { ...spotData },
    });
    return id;
  };

export const editSpot = (id, payload) => async (dispatch) => {
  const url = `/api/users/me/spots/${id}`;

  const response = await csrfFetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  const spot = await response.json();

  dispatch({ type: CREATE_SPOT, spot });
};

//delete one spot
export const deleteSpot = (id) => async (dispatch) => {
  const url = `/api/spots/${id}`;

  await csrfFetch(url, {
    method: "DELETE",
  });

  dispatch({ type: DELETE_SPOT, id });
};

const initialState = { spots: {} };

const spots = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case GET_ALL_SPOTS:
      newState.spots = {};
      action.spots.forEach((spot) => {
        newState.spots[spot.id] = spot;
      });
      return newState;

    case GET_ONE_SPOT:
      newState.spots = { ...newState.spots, [action.spot.id]: action.spot };

      return newState;
    case CREATE_SPOT:
      newState.spots = { ...newState.spots };
      newState.spots[action.spot.id] = action.spot;
      return newState;
    case DELETE_SPOT:
      newState.spots = { ...newState.spots };
      delete newState.spots[action.id];
      return newState;
    default:
      return state;
  }
};

export default spots;
