import { useEffect } from "react";

const Alert = ({ alert, setAlert }) => {
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alert, setAlert]);

  return (
    <div
      className={`alert alert-${alert.status} alert-dismissible fade show mt-3`}
      role="alert"
    >
      {alert.message}
      <button
        onClick={() => setAlert(null)}
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
};

export default Alert;
