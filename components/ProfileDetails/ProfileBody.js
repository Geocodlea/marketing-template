"use client";

import React, { useState } from "react";

const ProfileBody = () => {
  const [text, setText] = useState(
    "Numele meu este Fazlay Elahi Rafi și sunt un Dezvoltator Front-End la #Rainbow IT în Bangladesh, OR. Am o pasiune serioasă pentru efectele UI, animații și crearea de experiențe de utilizator intuitive și dinamice."
  );

  const handleChange = (event) => {
    setText(event.target.value);
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
                action="#"
                className="rbt-profile-row rbt-default-form row row--15"
              >
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="firstname">Prenume</label>
                    <input id="firstname" type="text" defaultValue="Fazlay" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="lastname">Nume de Familie</label>
                    <input id="lastname" type="text" defaultValue="Elahi" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="username">Nume de Utilizator</label>
                    <input id="username" type="text" defaultValue="Rafi" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="phonenumber">Număr de Telefon</label>
                    <input
                      id="phonenumber"
                      type="tel"
                      defaultValue="+1-202-555-0174"
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
                      value={text}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-12 mt--20">
                  <div className="form-group mb--0">
                    <a className="btn-default" href="#">
                      Actualizează Informațiile
                    </a>
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
              <form
                action="#"
                className="rbt-profile-row rbt-default-form row row--15"
              >
                <div className="col-11 text-Center">
                  <p className="mb--20">
                    <strong>Avertisment: </strong>Ștergerea contului tău va
                    șterge permanent toate datele tale și nu poate fi inversată.
                    Aceasta include profilul tău, conversațiile, comentariile și
                    orice altă informație legată de contul tău. Ești sigur că
                    vrei să continui cu ștergerea contului? Introdu parola
                    pentru a confirma.
                  </p>
                </div>

                <div className="col-12 mt--20">
                  <div className="form-group mb--0">
                    <a className="btn-default" href="#">
                      <i className="feather-trash-2"></i> Șterge Contul
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileBody;
