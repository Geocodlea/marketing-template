"use client";

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

const ProfileForm = ({ user, updateAccount }) => {
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  return (
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
        <div className="col-12 my-4">
          <div className="form-group mb--0">
            <button className="btn-default">Actualizează Informațiile</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
