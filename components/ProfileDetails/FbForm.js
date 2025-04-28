"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

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

const FbForm = ({ user, updateAccount }) => {
  const {
    register: registerFb,
    handleSubmit: handleSubmitFb,
    formState: { errors: fbErrors },
  } = useForm({
    resolver: yupResolver(fbSchema),
  });

  return (
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
                user.facebook?.adAccountId ? "Setat" : "Ex.: 1653034732758696"
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
                user.facebook?.pageId ? "Setat" : "Ex.: 614020611786833"
              }
              {...registerFb("pageId")}
              className={`form-control ${fbErrors.pageId ? "is-invalid" : ""}`}
            />
            {fbErrors.pageId && (
              <div className="invalid-feedback">{fbErrors.pageId.message}</div>
            )}
          </div>
        </div>

        <div className="col-12 mt-4">
          <div className="form-group mb--0">
            <button className="btn-default">Actualizează Datele</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FbForm;
