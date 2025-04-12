"use client";

import { useState } from "react";
import UserNav from "../Common/UserNav";
import Pricing from "../Pricing/Pricing";
import PricingData from "../../data/pricing.json";
import Compare from "../Pricing/Compare";

import { formattedDate } from "@/utils/helpers";
import Alert from "@/components/Common/Alert";

const PlansBilling = ({
  plan,
  planExpiresAt,
  paymentStatus,
  subscriptionId,
}) => {
  const [alert, setAlert] = useState("");

  const cancelSubscription = async () => {
    try {
      const res = await fetch("/api/stripe/cancelSubscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({
          status: data.status,
          message: data.message,
        });
      } else {
        setAlert({ status: result.status, message: result.message });
      }
    } catch (error) {
      setAlert({
        status: "danger",
        message: "A apărut o eroare. Vă rugăm să încercați mai târziu.",
      });
    }
  };

  return (
    <>
      <div className="rbt-main-content mb-0">
        <div className="rbt-daynamic-page-content center-width">
          <div className="rbt-dashboard-content">
            <UserNav title="Plans & Billing" />

            {paymentStatus && (
              <p>
                Vă mulțumim pentru achiziție! Un e-mail de confirmare a fost
                trimis către adresa dvs. Dacă aveți întrebări, nu ezitați să ne
                contactați.
              </p>
            )}

            {plan && (
              <p>
                Utilizați în prezent planul <strong>{plan}</strong>. Abonamentul
                dvs. este valabil până în{" "}
                <strong>{formattedDate(planExpiresAt)}</strong>. Pentru a
                modifica sau reînnoi planul, accesați opțiunile de mai jos.
              </p>
            )}

            <div className="content-page pb--50">
              <div className="aiwave-pricing-area wrapper">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12">
                      <nav className="aiwave-tab">
                        <div
                          className="tab-btn-grp nav nav-tabs text-center justify-content-center"
                          id="nav-tab"
                          role="tablist"
                        >
                          {PricingData &&
                            PricingData.pricing.map((data, index) => (
                              <button
                                className={`nav-link ${
                                  data.isSelect ? "active" : ""
                                }`}
                                id={`${data.priceId}-tab`}
                                data-bs-toggle="tab"
                                data-bs-target={`#${data.priceId}`}
                                type="button"
                                role="tab"
                                aria-controls={data.priceId}
                                aria-selected={data.isSelect}
                                key={index}
                              >
                                {data.priceType}{" "}
                                {data.discount ? (
                                  <span className="rainbow-badge-card badge-border">
                                    -{data.discount}%
                                  </span>
                                ) : (
                                  ""
                                )}
                              </button>
                            ))}
                        </div>
                      </nav>
                    </div>
                  </div>

                  <Pricing
                    parentClass="col-lg-6 col-md-6 col-12"
                    start={1}
                    end={3}
                    isHeading={false}
                    isBadge={false}
                    plan={plan}
                  />
                </div>
              </div>
            </div>

            <div className="rbt-sm-separator"></div>
            <Compare subTitle="" title="Detailed Compare" postion="left" />

            {/* Cancel subscription section */}
            {subscriptionId && (
              <div className="my-5 text-center">
                <p>
                  Dacă doriți să renunțați la abonament, apăsați butonul de mai
                  jos.
                </p>
                <button
                  className="btn-default btn-small"
                  onClick={cancelSubscription}
                >
                  Anulează abonamentul
                </button>
                {alert && <Alert alert={alert} setAlert={setAlert} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlansBilling;
