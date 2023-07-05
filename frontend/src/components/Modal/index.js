import React, { useRef } from "react";
import "./Modal.css";

const Modal = ({ children, onClose, title }) => {
  const containerRef = useRef();
  return (
    <div className="Modal-background">
      <div className="Modal-container" ref={containerRef}>
        <h1 className="Modal-title">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default Modal;
