"use client";

import Image from "next/image";
import logo from "@/public/images/logo/logo.png";
import userImg from "@/public/images/team/team-02sm.jpg";
import brandImg from "@/public/images/brand/brand-t.png";
import facebook from "@/public/images/sign-up/facebook.png";
import tiktok from "@/public/images/sign-up/tiktok.webp";

import { signIn } from "next-auth/react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const emailSchema = Yup.object({
  email: Yup.string()
    .email("Emailul nu este valid.")
    .required("Emailul este obligatoriu."),
});

const SigninPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  const sendEmail = ({ email }) => {
    signIn("email", { email, callbackUrl: "/" });
  };

  return (
    <>
      <main className="page-wrapper">
        <div className="signup-area">
          <div className="wrapper">
            <div className="row">
              <div className="col-lg-6 bg-color-blackest left-wrapper">
                <div className="sign-up-box">
                  <div className="signup-box-top">
                    <Image
                      src={logo}
                      width={193}
                      height={50}
                      alt="sign-up logo"
                    />
                  </div>
                  <div className="signup-box-bottom">
                    <div className="signup-box-content">
                      {/* <div className="social-btn-grp">
                        <button
                          className="btn-default btn-border"
                          onClick={() =>
                            signIn("facebook", { callbackUrl: "/" })
                          }
                        >
                          <span className="icon-left">
                            <Image
                              src={facebook}
                              width={18}
                              height={18}
                              alt="Facebook Icon"
                            />
                          </span>
                          Login cu Facebook
                        </button>
                      </div>

                      <br />

                      <div className="social-btn-grp">
                        <button
                          className="btn-default btn-border"
                          onClick={() => signIn("tiktok", { callbackUrl: "/" })}
                        >
                          <span className="icon-left">
                            <Image
                              src={tiktok}
                              width={18}
                              height={18}
                              alt="TikTok Icon"
                            />
                          </span>
                          Login cu TikTok
                        </button>
                      </div>

                      <div className="rbt-sm-separator"></div> */}

                      <form onSubmit={handleSubmit(sendEmail)}>
                        <div className="social-btn-grp">
                          <div className="signup-wrapper">
                            <input
                              id="email"
                              type="text"
                              placeholder="contact@adpilot.ro"
                              {...register("email")}
                              className={`signup-email form-control ${
                                errors.email ? "is-invalid" : ""
                              }`}
                            />
                            {errors.email && (
                              <div className="invalid-feedback">
                                {errors.email.message}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="social-btn-grp">
                          <button
                            type="submit"
                            className="btn-default btn-border"
                          >
                            <span className="icon-left">
                              <i className="contact-icon fa-sharp fa-regular fa-envelope"></i>
                            </span>
                            Login cu Email
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 right-wrapper">
                <div className="client-feedback-area">
                  <div className="single-feedback">
                    <div className="inner">
                      <div className="meta-img-section">
                        <a className="image" href="#">
                          <Image
                            src={userImg}
                            width={93}
                            height={93}
                            alt="User Image"
                          />
                        </a>
                      </div>
                      <div className="rating">
                        <a href="#rating">
                          <i className="fa-sharp fa-solid fa-star"></i>
                        </a>
                        <a href="#rating">
                          <i className="fa-sharp fa-solid fa-star"></i>
                        </a>
                        <a href="#rating">
                          <i className="fa-sharp fa-solid fa-star"></i>
                        </a>
                        <a href="#rating">
                          <i className="fa-sharp fa-solid fa-star"></i>
                        </a>
                        <a href="#rating">
                          <i className="fa-sharp fa-solid fa-star"></i>
                        </a>
                      </div>
                      <div className="content">
                        <p className="description">
                          Rainbow-Themes is now a crucial component of our work!
                          We made it simple to collaborate across departments by
                          grouping our work
                        </p>
                        <div className="bottom-content">
                          <div className="meta-info-section">
                            <h4 className="title-text mb--0">Guy Hawkins</h4>
                            <p className="desc mb--20">Nursing Assistant</p>
                            <div className="desc-img">
                              <Image
                                src={brandImg}
                                width={83}
                                height={23}
                                alt="Brand Image"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SigninPage;
