import React, { useRef } from "react";
import "./Modal.css";

const Modal = ({ children, onClose, title }) => {
  const containerRef = useRef();
  return (
    <div className="Modal-container">
      <div className="Modal-background" onClick={onClose}></div>
      <div className="Modal-content" ref={containerRef}>
        {onClose && (
          <div className="Modal-close-tag">
            <i class="fa-solid fa-xmark" onClick={onClose}></i>
          </div>
        )}
        <h1 className="Modal-title">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default Modal;
