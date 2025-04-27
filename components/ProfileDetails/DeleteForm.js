"use client";

import Modal from "@/components/Common/Modal";

const DeleteForm = ({ deleteAccount }) => {
  return (
    <div
      className="tab-pane fade"
      id="delaccount"
      role="tabpanel"
      aria-labelledby="del-account-tab"
    >
      <p className="mb-5">
        <strong>Avertisment: </strong>Ștergerea contului tău va șterge permanent
        toate datele tale și nu poate fi inversată. Aceasta include profilul
        tău, conversațiile, comentariile și orice altă informație legată de
        contul tău. Ești sigur că vrei să continui cu ștergerea contului?
      </p>

      <button
        data-bs-toggle="modal"
        data-bs-target="#deleteAccountModal"
        className="react-btn btn-default"
      >
        <i className="feather-trash-2"></i>Șterge Contul
      </button>

      <Modal deleteAccount={deleteAccount} />
    </div>
  );
};

export default DeleteForm;
