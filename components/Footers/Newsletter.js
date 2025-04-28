"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from "../../public/images/logo/logo.png";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Alert from "@/components/Common/Alert";

const emailSchema = Yup.object({
  email: Yup.string()
    .email("Emailul nu este valid.")
    .required("Emailul este obligatoriu."),
});

const Newsletter = () => {
  const [alert, setAlert] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  const subscribeToNewsletter = async ({ email }) => {
    try {
      const response = await fetch(`/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      setAlert({
        status: result.status,
        message: result.message,
      });
    } catch (error) {
      console.error("Error:", error);
      setAlert({
        status: "danger",
        message: "A apărut o eroare. Te rugăm să încerci mai târziu.",
      });
    }
  };

  return (
    <>
      <div className="rainbow-footer-widget">
        <div className="logo">
          <Link href="/">
            <Image
              className="logo-light"
              src={logo}
              width={135}
              height={35}
              alt="ChatBot Logo"
            />
          </Link>
        </div>
        <p className="b1 desc-text">
          Prima platformă de chatbot pentru crearea reclamelor online.
        </p>
        <h6 className="subtitle">Înscrie-te la Newsletter</h6>
        <form
          className="newsletter-form"
          onSubmit={handleSubmit(subscribeToNewsletter)}
        >
          <div className="form-group d-flex">
            <input
              id="email"
              type="text"
              placeholder="Introdu e-mail-ul tău aici"
              {...register("email")}
              className={`signup-email form-control ${
                errors.email ? "is-invalid" : ""
              }`}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}

            <button className="btn-default bg-solid-primary" type="submit">
              <i className="fa-sharp fa-regular fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>

      {alert && <Alert alert={alert} setAlert={setAlert} />}
    </>
  );
};

export default Newsletter;
