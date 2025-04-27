"use client";

import { useEffect, useRef } from "react";
import sal from "sal.js";

const Alert = ({ alert, setAlert }) => {
  const alertRef = useRef();

  useEffect(() => {
    if (alert) {
      sal();

      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alert, setAlert]);

  if (!alert) return null;

  return (
    <div
      ref={alertRef}
      className={`alert alert-${alert.status} alert-dismissible fade show mt-3`}
      role="alert"
      data-sal="zoom-in"
      data-sal-duration="700"
      data-sal-easing="ease-out-bounce"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        minWidth: "300px",
      }}
    >
      {alert.message}
      <button
        onClick={() => setAlert(null)}
        type="button"
        className="btn-close"
        aria-label="Close"
      ></button>
    </div>
  );
};

export default Alert;
