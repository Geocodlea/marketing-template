"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Alert from "@/components/Common/Alert";
import Modal from "@/components/Common/Modal";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const profileSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\d*$/, "Numărul trebuie să conțină doar cifre.")
    .test(
      "exact-length-or-empty",
      "Numărul trebuie să aibă exact 10 cifre.",
      (value) => value === "" || value.length === 10
    ),
});

const fbSchema = Yup.object().shape({
  adAccountId: Yup.string()
    .matches(/^\d*$/, "Numărul trebuie să conțină doar cifre.")
    .test(
      "exact-length-or-empty",
      "Numărul trebuie să aibă exact 16 cifre.",
      (value) => value === "" || value.length === 16
    ),
  pageId: Yup.string()
    .matches(/^\d*$/, "Numărul trebuie să conțină doar cifre.")
    .test(
      "exact-length-or-empty",
      "Numărul trebuie să aibă exact 15 cifre.",
      (value) => value === "" || value.length === 15
    ),
});

const ProfileBody = ({ userData }) => {
  const [alert, setAlert] = useState(null);
  const user = JSON.parse(userData);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  const {
    register: registerFb,
    handleSubmit: handleSubmitFb,
    formState: { errors: fbErrors },
  } = useForm({
    resolver: yupResolver(fbSchema),
  });

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm();

  const updateAccount = async (accountDetails) => {
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountDetails }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert(data);
      } else {
        setAlert(data);
      }
    } catch (error) {
      setAlert({
        status: "danger",
        message: `A apărut o eroare: ${error.message}`,
      });
    }
  };

  const deleteAccount = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setAlert(data);
        signOut();
      } else {
        setAlert(data);
      }
    } catch (error) {
      setAlert({
        status: "danger",
        message: `A apărut o eroare: ${error.message}`,
      });
    }
  };

  return (
    <>
      <div className="single-settings-box profile-details-box overflow-hidden">
        <div className="profile-details-tab">
          <div className="advance-tab-button mb--30">
            <ul
              className="nav nav-tabs tab-button-style-2 justify-content-start"
              id="settinsTab-4"
              role="tablist"
            >
              <li role="presentation">
                <a
                  href="#"
                  className="tab-button active"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="true"
                >
                  <span className="title">Profil</span>
                </a>
              </li>

              <li role="presentation">
                <a
                  href="#"
                  className="tab-button"
                  id="fb-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#fb"
                  role="tab"
                  aria-controls="fb"
                  aria-selected="false"
                >
                  <span className="title">Facebook</span>
                </a>
              </li>

              <li role="presentation">
                <a
                  href="#"
                  className="tab-button"
                  id="email-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#email"
                  role="tab"
                  aria-controls="email"
                  aria-selected="false"
                >
                  <span className="title">Email</span>
                </a>
              </li>

              <li role="presentation">
                <a
                  href="#"
                  className="tab-button"
                  id="del-account-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#delaccount"
                  role="tab"
                  aria-controls="delaccount"
                  aria-selected="false"
                >
                  <span className="title">Șterge Contul</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="tab-content">
            <div
              className="tab-pane fade active show"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <form
                onSubmit={handleSubmitProfile(updateAccount)}
                className="rbt-profile-row rbt-default-form row row--15"
              >
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="firstname">Prenume</label>
                    <input
                      id="firstname"
                      type="text"
                      placeholder={user.firstname}
                      {...registerProfile("firstname")}
                      className={`form-control ${
                        profileErrors.firstname ? "is-invalid" : ""
                      }`}
                    />
                    {profileErrors.firstname && (
                      <div className="invalid-feedback">
                        {profileErrors.firstname.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="lastname">Nume de Familie</label>
                    <input
                      id="lastname"
                      type="text"
                      placeholder={user.lastname}
                      {...registerProfile("lastname")}
                      className={`form-control ${
                        profileErrors.lastname ? "is-invalid" : ""
                      }`}
                    />
                    {profileErrors.lastname && (
                      <div className="invalid-feedback">
                        {profileErrors.lastname.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="phone">Număr de Telefon</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder={user.phone}
                      {...registerProfile("phone")}
                      className={`form-control ${
                        profileErrors.phone ? "is-invalid" : ""
                      }`}
                    />
                    {profileErrors.phone && (
                      <div className="invalid-feedback">
                        {profileErrors.phone.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12 mt--20">
                  <div className="form-group mb--0">
                    <button className="btn-default">
                      Actualizează Informațiile
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div
              className="tab-pane fade"
              id="fb"
              role="tabpanel"
              aria-labelledby="fb-tab"
            >
              <form
                onSubmit={handleSubmitFb(updateAccount)}
                className="rbt-profile-row rbt-default-form row row--15"
              >
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="adAccountId">Cont de Publicitate</label>
                    <input
                      id="adAccountId"
                      type="text"
                      placeholder={
                        user.facebook.adAccountId
                          ? "Setat"
                          : "Ex.: 1653034732758696"
                      }
                      {...registerFb("adAccountId")}
                      className={`form-control ${
                        fbErrors.adAccountId ? "is-invalid" : ""
                      }`}
                    />
                    {fbErrors.adAccountId && (
                      <div className="invalid-feedback">
                        {fbErrors.adAccountId.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="pageId">Pagina de Facebook</label>
                    <input
                      id="pageId"
                      type="text"
                      placeholder={
                        user.facebook.pageId ? "Setat" : "Ex.: 614020611786833"
                      }
                      {...registerFb("pageId")}
                      className={`form-control ${
                        fbErrors.pageId ? "is-invalid" : ""
                      }`}
                    />
                    {fbErrors.pageId && (
                      <div className="invalid-feedback">
                        {fbErrors.pageId.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12 mt--20">
                  <div className="form-group mb--0">
                    <button className="btn-default">Actualizează Datele</button>
                  </div>
                </div>
              </form>
            </div>

            <div
              className="tab-pane fade"
              id="email"
              role="tabpanel"
              aria-labelledby="email-tab"
            >
              <form
                onSubmit={handleSubmitEmail(updateAccount)}
                className="rbt-profile-row rbt-default-form row row--15"
              >
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="brevoApiKey">Brevo API Key</label>
                    <input
                      id="brevoApiKey"
                      type="text"
                      placeholder={
                        user.brevoApiKey
                          ? "Setat"
                          : "Ex.: x45ysib-bce8fc03b0174b367054e179be94c4f7a88c046afc116d3ffd528a9ceb5b5a3f-SBic7p0Pev7K4bvX"
                      }
                      {...registerEmail("brevoApiKey")}
                      className={`form-control ${
                        emailErrors.brevoApiKey ? "is-invalid" : ""
                      }`}
                    />
                    {emailErrors.brevoApiKey && (
                      <div className="invalid-feedback">
                        {emailErrors.brevoApiKey.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12 mt--20">
                  <div className="form-group mb--0">
                    <button className="btn-default">Actualizează Datele</button>
                  </div>
                </div>
              </form>
            </div>

            <div
              className="tab-pane fade"
              id="delaccount"
              role="tabpanel"
              aria-labelledby="del-account-tab"
            >
              <p className="mb--20">
                <strong>Avertisment: </strong>Ștergerea contului tău va șterge
                permanent toate datele tale și nu poate fi inversată. Aceasta
                include profilul tău, conversațiile, comentariile și orice altă
                informație legată de contul tău. Ești sigur că vrei să continui
                cu ștergerea contului?
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
          </div>

          {alert && <Alert alert={alert} setAlert={setAlert} />}
        </div>
      </div>
    </>
  );
};

export default ProfileBody;
