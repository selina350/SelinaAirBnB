import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { deleteSpot } from "../../store/spots";
import Modal from "../Modal";
import "./SpotSummary.css";
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
  };
  return (
    <div className="spot-summary">
      <Link to={`/spots/${spot.id}`}>
        <div>
          <img src={spot.previewImage} />
          <div className="spot-summary-text">
            <div className="spot-summary-text-first-row">
              <div>
                {spot.city}, {spot.state}
              </div>
              <div className="spot-summary-rate">
                <i className="fa-solid fa-star" />
                &nbsp;
                {spot.avgRating}
                {spot.avgRating === null ? "New" : null}
              </div>
            </div>

            <div>$ {spot.price}</div>
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
            <button onClick={handleDelete}>Yes</button>
            <button
              className="primary"
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

export default SpotSummary;
