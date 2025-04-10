const Alert = ({ alert, setAlert }) => {
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
