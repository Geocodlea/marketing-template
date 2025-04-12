"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Alert from "@/components/Common/Alert";
import Modal from "@/components/Common/Modal";

const ProfileBody = () => {
  const { data: session } = useSession();
  const [alert, setAlert] = useState(null);

  // Profile form fields
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [bio, setBio] = useState("");

  // Facebook form fields
  const [adAccountId, setAdAccountId] = useState("");
  const [pageId, setPageId] = useState("");
  const [formId, setFormId] = useState("");

  const updateAccount = async (e) => {
    e.preventDefault();

    // Collect form data into an object
    const accountDetails = {
      firstname,
      lastname,
      username,
      phonenumber,
      bio,
    };

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
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

  const updateFbFields = async (e) => {
    e.preventDefault();

    // Collect form data into an object
    const fbDetails = {
      adAccountId,
      pageId,
      formId,
    };

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fbDetails }),
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
      const response = await fetch(`/api/users/${session.user.id}`, {
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
              <form className="rbt-profile-row rbt-default-form row row--15">
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="firstname">Prenume</label>
                    <input
                      id="firstname"
                      type="text"
                      value={firstname}
                      placeholder={session?.user.firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="lastname">Nume de Familie</label>
                    <input
                      id="lastname"
                      type="text"
                      value={lastname}
                      placeholder={session?.user.lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="username">Nume de Utilizator</label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      placeholder={session?.user.username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="phonenumber">Număr de Telefon</label>
                    <input
                      id="phonenumber"
                      type="tel"
                      value={phonenumber}
                      placeholder={session?.user.phonenumber}
                      onChange={(e) => setPhonenumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="bio">Biografie</label>
                    <textarea
                      id="bio"
                      cols="20"
                      rows="5"
                      value={bio}
                      placeholder={session?.user.bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12 mt--20">
                  <div className="form-group mb--0">
                    <button onClick={updateAccount} className="btn-default">
                      Actualizează Informațiile
                    </button>
                  </div>
                </div>

                {alert && <Alert alert={alert} setAlert={setAlert} />}
              </form>
            </div>

            <div
              className="tab-pane fade"
              id="fb"
              role="tabpanel"
              aria-labelledby="fb-tab"
            >
              <form className="rbt-profile-row rbt-default-form row row--15">
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="adAccountId">Cont de Publicitate</label>
                    <input
                      id="adAccountId"
                      type="text"
                      value={adAccountId}
                      placeholder={"Ex.: 1653034732758696"}
                      onChange={(e) => setAdAccountId(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="pageId">Pagina de Facebook</label>
                    <input
                      id="pageId"
                      type="text"
                      value={pageId}
                      placeholder={"Ex.: 614020611786833"}
                      onChange={(e) => setPageId(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="formId">Formular de Leaduri</label>
                    <input
                      id="formId"
                      type="text"
                      value={formId}
                      placeholder={"Ex.: 1377801553236600"}
                      onChange={(e) => setFormId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-12 mt--20">
                  <div className="form-group mb--0">
                    <button onClick={updateFbFields} className="btn-default">
                      Actualizează Datele
                    </button>
                  </div>
                </div>

                {alert && <Alert alert={alert} setAlert={setAlert} />}
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
              {alert && <Alert alert={alert} setAlert={setAlert} />}
              <Modal deleteAccount={deleteAccount} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileBody;
