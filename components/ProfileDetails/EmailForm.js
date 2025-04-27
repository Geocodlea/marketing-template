"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import EmailList from "./EmailList";

const emailSchema = Yup.object().shape({
  brevoEmail: Yup.string().email("Emailul nu este valid."),
  brevoName: Yup.string(),
});
const EmailForm = ({ user, updateAccount, dnsRecords }) => {
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  return (
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
            <label htmlFor="brevoEmail">Email Utilizat</label>
            <input
              id="brevoEmail"
              type="text"
              placeholder={user.brevo.email || "contact@adpilot.ro"}
              {...registerEmail("brevoEmail")}
              className={`form-control ${
                emailErrors.brevoEmail ? "is-invalid" : ""
              }`}
            />
            {emailErrors.brevoEmail && (
              <div className="invalid-feedback">
                {emailErrors.brevoEmail.message}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
          <div className="form-group">
            <label htmlFor="brevoName">Nume Email</label>
            <input
              id="brevoName"
              type="text"
              placeholder={user.brevo.name || "Adpilot"}
              {...registerEmail("brevoName")}
              className={`form-control ${
                emailErrors.brevoName ? "is-invalid" : ""
              }`}
            />
            {emailErrors.brevoName && (
              <div className="invalid-feedback">
                {emailErrors.brevoName.message}
              </div>
            )}
          </div>
        </div>

        {dnsRecords && Object.values(dnsRecords).some((record) => record) && (
          <div className="col-12 mt-4">
            <h4 className="mb-2 fw-semibold">
              Setează următoarele recorduri DNS:
            </h4>
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>Tip</th>
                  <th>Host</th>
                  <th>Valoare</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dnsRecords).map(([key, record], index) => {
                  if (!record) return null;
                  return (
                    <tr
                      key={index}
                      className={
                        record.status ? "table-success" : "table-danger"
                      }
                    >
                      <td>{record.type}</td>
                      <td>{record.host_name}</td>
                      <td style={{ wordBreak: "break-all" }}>{record.value}</td>
                      <td>
                        {record.status ? (
                          <span className="text-success">Valid</span>
                        ) : (
                          <span className="text-danger">Invalid</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="col-12 my-4">
          <div className="form-group mb--0">
            <button className="btn-default">Actualizează Datele</button>
          </div>
        </div>
      </form>

      <EmailList userId={user._id} />
    </div>
  );
};

export default EmailForm;
