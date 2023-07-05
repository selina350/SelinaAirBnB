import React, { useState, useEffect } from "react";

import * as spotsAction from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink, useHistory, useParams } from "react-router-dom";

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
  let imageURLs = [];
  let previewImage = {};
  if (spot.SpotImages) {
    previewImage = spot.SpotImages.find((image) => image.preview);
    spot.SpotImages.forEach((image, i) => {
      if (!image.preview) {
        imageURLs.push(image.url);
      }
    });
  }

  const [previewImg, setPreviewImg] = useState(previewImage.url);
  const [images, setImages] = useState(imageURLs);
  // const [img1, setImg1] = useState(imageURLs[0]);
  // const [img2, setImg2] = useState(imageURLs[1]);
  // const [img3, setImg3] = useState(imageURLs[2]);
  // const [img4, setImg4] = useState(imageURLs[3]);
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
    imageURLs.forEach((imageUrl) => {
      if (
        imageUrl.endsWith(".png") ||
        imageUrl.endsWith(".jpg") ||
        imageUrl.endsWith(".jpeg")
      ) {
        errors.imageUrl = "Image url must ends  in .png, jpg, or .jpeg";
      }
    });
    // if (
    //   img1.length > 0 &&
    //   !(
    //     img1.endsWith(".png") ||
    //     img1.endsWith(".jpg") ||
    //     img1.endsWith(".jpeg")
    //   )
    // ) {
    //   errors.img1 = "Image url must ends  in .png, jpg, or .jpeg";
    // }

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
    ...imageURLs,

    // img1,
    // img2,
    // img3,
    // img4,
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
      previewImg,
      ...imageURLs,
      // img1,
      // img2,
      // img3,
      // img4,
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
      dispatch(spotsAction.createSpot(payload))
        .then((id) => history.push(`/spots/${id}`))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.validationErrors)
            setValidationErrors(data.validationErrors);
        });
    }
  };

  return (
    <>
      <h1>{isEditing ? "Update Spot" : " Create Spot"} </h1>
      <form className="Login-form" onSubmit={handleSubmit}>
        <lable>Country </lable>
        <input
          placeholder="Country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        {hasSubmitted && validationErrors.country}
        <lable>Street Address </lable>
        <input
          placeholder="Street Address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        {hasSubmitted && validationErrors.address}
        <lable>City </lable>
        <input
          placeholder="City"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        {hasSubmitted && validationErrors.city}
        <lable>State </lable>
        <input
          placeholder="State"
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
        {hasSubmitted && validationErrors.state}
        <lable>Latitude </lable>
        <input
          placeholder="Latitude"
          type="text"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <lable>Longitude </lable>
        <input
          placeholder="Longitude"
          type="text"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
        />

        <lable> Describe your place to guests </lable>
        <p>
          Mention the best features of your space, any specific amentities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>
        <input
          placeholder="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {hasSubmitted && validationErrors.description}
        <lable> Create a title for yoru spot </lable>
        <p>
          Catch guest's attention with a spot title that highlights what makes
          yoru place special.
        </p>
        <input
          placeholder="Name of your spot"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {hasSubmitted && validationErrors.name}
        <lable> Set a base price for your spot </lable>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>
        <input
          placeholder="Price per night(USD)"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        {hasSubmitted && validationErrors.price}
        <lable> Liven up your spot with photos </lable>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <input
          placeholder="Preview Image URL"
          type="text"
          value={previewImg}
          onChange={(e) => setPreviewImg(e.target.value)}
          required
        />
        {hasSubmitted && validationErrors.previewImg}
        <div className="other-img">
          {images.map((imageUrl, i) => {
            return (
              <div>
                <input
                  placeholder="Image URL"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImages(e.target.value[i])}
                  required
                />
                {hasSubmitted && validationErrors.imageUrl}
              </div>
            );
          })}
        </div>

        {/* <input
          placeholder="Image URL"
          type="text"
          value={img1}
          onChange={(e) => setImg1(e.target.value)}
          required
        />
        {hasSubmitted && validationErrors.img1}
        <input
          placeholder="Image URL"
          type="text"
          value={img2}
          onChange={(e) => setImg2(e.target.value)}
          required
        />
        <input
          placeholder="Image URL"
          type="text"
          value={img3}
          onChange={(e) => setImg3(e.target.value)}
          required
        />
        <input
          placeholder="Image URL"
          type="text"
          value={img4}
          onChange={(e) => setImg4(e.target.value)}
          required
        /> */}
      </form>

      <button className="primary" onClick={handleSubmit}>
        {isEditing ? "Update Spot" : "Create Spot"}
      </button>
    </>
  );
}

export default CreateNewSpot;
