import React, { useState, useEffect } from "react";

import * as spotsAction from "../../store/spots";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import "./CreateNewSpot.css";

function CreateNewSpot({ spot = {} }) {
  const dispatch = useDispatch();

  const [country, setCountry] = useState(spot.country);
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [lat, setLat] = useState(spot.lat);
  const [lng, setLng] = useState(spot.lng);
  const [description, setDescription] = useState(spot.description);
  const [name, setName] = useState(spot.name);
  const [price, setPrice] = useState(spot.price);

  let imageURLs = ["", "", "", ""];
  let previewImageURL;

  //if editing
  if (spot.SpotImages) {
    const previewImageObj = spot.SpotImages.find((image) => image.preview);
    if (previewImageObj) {
      previewImageURL = previewImageObj.url;
    }
    spot.SpotImages.filter((image) => !image.preview).forEach((image, i) => {
      imageURLs[i] = image.url;
    });
  }
  const [previewImg, setPreviewImg] = useState(previewImageURL);
  const [images, setImages] = useState(imageURLs);
  const [validationErrors, setValidationErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isEditing = spot.id !== undefined;
  useEffect(() => {
    const errors = {};
    if (country === undefined || country.length === 0) {
      errors.country = "Country is required.";
    }
    if (address === undefined || address.length === 0) {
      errors.address = "Address is required.";
    }
    if (city === undefined || city.length === 0) {
      errors.city = "City is required.";
    }
    if (state === undefined || state.length === 0) {
      errors.state = "State is required.";
    }
    if (description === undefined || description.length === 0) {
      errors.description = "Description needs a minimum of 30 characters.";
    }else if(description.length >= 255){
      errors.description = "Description is too long(more than 255 characters).";
    }
    if (name === undefined || name.length === 0) {
      errors.name = "Name is required.";
    }
    if (price === undefined || price.length === 0) {
      errors.price = "Price is required.";
    }
    if (previewImg === undefined || previewImg.length === 0) {
      errors.previewImg = "PreviewImg is required.";
    }
    images.forEach((imageUrl, i) => {
      if (
        !(
          imageUrl.endsWith(".png") ||
          imageUrl.endsWith(".jpg") ||
          imageUrl.endsWith(".jpeg")
        )
      ) {
        errors[`image${i}`] = "Image url must ends  in .png, jpg, or .jpeg";
      }
    });
    
    setValidationErrors(errors);
  }, [
    country,
    address,
    city,
    state,
    description,
    name,
    price,
    previewImg,
    images,
  ]);
  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    const payload = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
    };
    if (Object.values(validationErrors).length > 0) {
      return;
    }
    if (isEditing) {
      dispatch(spotsAction.editSpot(spot.id, payload))
        .then(() => history.push(`/spots/${spot.id}`))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.validationErrors)
            setValidationErrors(data.validationErrors);
        });
    } else {
      dispatch(spotsAction.createSpot(payload, previewImg, images))
        .then((id) => history.push(`/spots/${id}`))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.validationErrors)
            setValidationErrors(data.validationErrors);
        });
    }
  };

  return (
    <div className="spot-form">
      <div className="spot-form-container">
        <h1>{isEditing ? "Update Spot" : " Create Spot"} </h1>
        <hr />
        <h3>Where is your place located?</h3>
        Guests will only get your exact address once they booked a reservation.
        <form className="Login-form" onSubmit={handleSubmit}>
          <label>Country </label>
          <input
            placeholder="Country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          <div className="error">
            {hasSubmitted && validationErrors.country}
          </div>
          <label>Street Address </label>
          <input
            placeholder="Street Address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <div className="error">
            {hasSubmitted && validationErrors.address}
          </div>
          <label>City </label>
          <input
            placeholder="City"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <div className="error">{hasSubmitted && validationErrors.city}</div>
          <label>State </label>
          <input
            placeholder="State"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
          <div className="error">{hasSubmitted && validationErrors.state}</div>
          <label>Latitude </label>
          <input
            placeholder="Latitude"
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <label>Longitude </label>
          <input
            placeholder="Longitude"
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
          <hr />
          <h3>Describe your place to guests</h3>

          <div>
            Mention the best features of your space, any specific amentities
            like fast wifi or parking, and what you love about the neighborhood.
          </div>

          <textarea
            placeholder="Description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="error">
            {hasSubmitted && validationErrors.description}
          </div>
          <hr />
          <h3> Create a title for your spot </h3>
          <div>
            Catch guest's attention with a spot title that highlights what makes
            yoru place special.
          </div>
          <input
            placeholder="Name of your spot"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="error">{hasSubmitted && validationErrors.name}</div>
          <hr />
          <h3> Set a base price for your spot </h3>
          <div>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </div>
          <input
            placeholder="Price per night(USD)"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <div className="error">{hasSubmitted && validationErrors.price}</div>
          <hr />
          <h3> Liven up your spot with photos </h3>
          <div>Submit a link to at least one photo to publish your spot.</div>
          <label>Preview Image</label>

          <input
            disabled={isEditing}
            placeholder="Preview Image URL"
            type="text"
            value={previewImg}
            onChange={(e) => setPreviewImg(e.target.value)}
            required
          />
          <div className="error">
            {hasSubmitted && validationErrors.previewImg}
          </div>
          <div className="other-images-container">
            {images.map((imageUrl, i) => {
              return (
                <div key={i} className="other-image">
                  <label>Other Image {i + 1}</label>
                  <input
                    disabled={isEditing}
                    placeholder="Image URL"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => {
                      const newImages = [...images];
                      newImages[i] = e.target.value;
                      setImages(newImages);
                    }}
                    required
                  />
                  <div className="error">
                    {hasSubmitted && validationErrors[`image${i}`]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* <hr /> */}
        </form>
        <button className="primary" onClick={handleSubmit}>
          {isEditing ? "Update Spot" : "Create Spot"}
        </button>
      </div>
    </div>
  );
}

export default CreateNewSpot;
