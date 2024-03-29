import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { deleteSpot } from "../../store/spots";
import Modal from "../Modal";
import "./SpotSummary.css";
import { starToDecimal } from "../../utils/spotHelper";
function SpotSummary({ spot, showAction }) {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const handleEdit = (e) => {
    history.push(`/spots/${spot.id}/edit`);
  };
  const handleDelete = (e) => {
    const id = spot.id;

    dispatch(deleteSpot(id));
    setConfirmModalOpen(false);
  };
  return (
    <div className="spot-summary">
      <Link to={`/spots/${spot.id}`}>
        <div>
          <div
            className="image"
            style={{ backgroundImage: `url('${spot.previewImage}')` }}
          >
            <span className="tooltiptext">{spot.name}</span>
          </div>

          <div className="spot-summary-text">
            <div className="spot-summary-text-first-row">
              <div>
                {spot.city}, {spot.state}
              </div>
              <div className="spot-summary-rate">
                <i className="fa-solid fa-star" />
                &nbsp;
                {spot.avgRating && starToDecimal(spot.avgRating)}
                {spot.avgRating === null ? "New" : null}
              </div>
            </div>

            <div>$ {spot.price} /night</div>
          </div>
        </div>
      </Link>
      {showAction && (
        <div>
          <button onClick={handleEdit}>Update</button>
          <button onClick={() => setConfirmModalOpen(true)}>Delete</button>
        </div>
      )}
      {confirmModalOpen && (
        <Modal title="Confirm Delete">
          <div>
            <h3>Are you sure to delete this spot from your listing? </h3>
            <button className="primary" onClick={handleDelete}>
              Yes
            </button>
            <button onClick={() => setConfirmModalOpen(false)}>No</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default SpotSummary;
