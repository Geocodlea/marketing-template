"use client";

import { useState, useTransition } from "react";
import { contact } from "@/actions/contact";
import Alert from "@/components/Common/Alert";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const contactSchema = Yup.object().shape({
  name: Yup.string().required("Numele este obligatoriu."),
  email: Yup.string()
    .required("Emailul este obligatoriu.")
    .email("Emailul nu este valid."),
  tel: Yup.string()
    .required("Numarul de telefon este obligatoriu.")
    .matches(/^\d{10}$/, "Numărul trebuie să aibă exact 10 cifre."),
  message: Yup.string()
    .required("Mesajul este obligatoriu.")
    .max(1000, "Mesajul nu poate depăși 1000 de caractere."),
});

const ContactForm = () => {
  const [isPending, startTransition] = useTransition();
  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = (data) => {
    setDisabled(true);
    startTransition(async () => {
      const result = await contact(data);

      setAlert({
        status: result.status,
        message: result.message,
      });

      if (result.status === "success") reset();
      setDisabled(false);
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rbt-profile-row rbt-default-form row row--15"
      >
        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
          <div className="form-group">
            <label htmlFor="name">Nume</label>
            <input
              id="name"
              type="text"
              placeholder="Nume..."
              {...register("name")}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email..."
              {...register("email")}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
          <div className="form-group">
            <label htmlFor="tel">Număr de telefon</label>
            <input
              id="tel"
              type="tel"
              placeholder="Număr de telefon..."
              {...register("tel")}
              className={`form-control ${errors.tel ? "is-invalid" : ""}`}
            />
            {errors.tel && (
              <div className="invalid-feedback">{errors.tel.message}</div>
            )}
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="message">Mesaj</label>
            <textarea
              id="message"
              rows="5"
              placeholder="Scrie mesajul tău aici..."
              {...register("message")}
              className={`form-control ${errors.message ? "is-invalid" : ""}`}
            />
            {errors.message && (
              <div className="invalid-feedback">{errors.message.message}</div>
            )}
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
