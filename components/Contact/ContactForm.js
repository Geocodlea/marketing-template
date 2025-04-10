"use client";

import { useState, useTransition } from "react";
import { contact } from "@/app/actions/contact";
import Alert from "@/components/Common/Alert";

const ContactForm = () => {
  const [isPending, startTransition] = useTransition();
  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = (formData) => {
    setDisabled(true);

    startTransition(async () => {
      const result = await contact(formData);

      setAlert({
        status: result.status,
        message: result.message,
      });

      setDisabled(false);
    });
  };

  return (
    <>
      <form
        action={handleSubmit}
        className="rbt-profile-row rbt-default-form row row--15"
      >
        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
          <div className="form-group">
            <label htmlFor="name">Nume</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Nume..."
            />
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email..."
            />
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
          <div className="form-group">
            <label htmlFor="tel">Număr de telefon</label>
            <input
              id="tel"
              name="tel"
              required
              type="tel"
              placeholder="Număr de telefon..."
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="message">Mesaj</label>
            <textarea
              id="message"
              name="message"
              required
              cols="20"
              rows="5"
            ></textarea>
          </div>
        </div>
        <div className="col-12 mt--20">
          <div className="form-group mb--0">
            <button
              type="submit"
              className="btn-default"
              disabled={disabled || isPending}
            >
              {isPending ? "Se trimite..." : "Contactează-ne"}
            </button>
          </div>
        </div>

        {alert && <Alert alert={alert} setAlert={setAlert} />}
      </form>
    </>
  );
};

export default ContactForm;
