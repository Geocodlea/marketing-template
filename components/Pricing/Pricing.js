"use client";

import { useState } from "react";

import PricingData from "../../data/pricing.json";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Alert from "@/components/Common/Alert";

const Pricing = ({ start, end, parentClass, isBadge, gap, plan }) => {
  const [sectionStates, setSectionStates] = useState({
    Premium: true,
    Enterprise: true,
  });
  const router = useRouter();
  const { data: session } = useSession();
  const [alert, setAlert] = useState(null);

  const toggleSection = (subTitle) => {
    setSectionStates((prevState) => ({
      ...prevState,
      [subTitle]: !prevState[subTitle],
    }));
  };

  const planSelect = async (plan) => {
    if (!session) router.push("/signin");
    if (plan === "Basic") router.push("/text-generator");

    try {
      const response = await fetch(`/api/stripe/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email: session.user.email }),
      });

      if (!response.ok) {
        throw new Error(`A apărut o eroare. Vă rugăm să încercați mai târziu.`);
      }

      const data = await response.json();
      router.push(data);
    } catch (error) {
      setAlert({
        status: "danger",
        message: error.message,
      });
    }
  };

  return (
    <>
      <div
        className="tab-content p-0 bg-transparent border-0 border bg-light"
        id="nav-tabContent"
      >
        {PricingData &&
          PricingData.pricing.map((data, index) => (
            <div
              className={`tab-pane fade ${data.isSelect ? "active show" : ""}`}
              id={data.priceId}
              role="tabpanel"
              aria-labelledby={`${data.priceId}-tab`}
              key={index}
            >
              <div className={`row row--15 ${gap}`}>
                {data.priceBody
                  .slice(start, end)
                  .map((innerData, innerIndex) => (
                    <div className={parentClass} key={innerIndex}>
                      <div
                        className={`rainbow-pricing style-aiwave ${
                          plan
                            ? innerData.subTitle.toLowerCase() === plan
                              ? "active"
                              : ""
                            : innerData.isSelect
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="pricing-table-inner">
                          <div className="pricing-top">
                            <div className="pricing-header">
                              <div className="icon">
                                <i className={innerData.iconClass}></i>
                              </div>
                              <h4
                                className={`title color-var-${innerData.classNum}`}
                              >
                                {innerData.subTitle}
                              </h4>
                              <p className="subtitle">{innerData.title}</p>
                              <div className="pricing">
                                <span className="price-text">
                                  {innerData.price}
                                </span>
                                <span className="text">
                                  {innerData.priceFor}
                                </span>
                              </div>
                            </div>
                            <div className="pricing-body">
                              <div
                                className={`features-section has-show-more ${
                                  !sectionStates[innerData.subTitle]
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <h6>{innerData.text}</h6>
                                <ul className="list-style--1 has-show-more-inner-content">
                                  {innerData.listItem.map((list, i) => (
                                    <li key={i}>
                                      <i className="fa-regular fa-circle-check"></i>
                                      {list.text}
                                    </li>
                                  ))}
                                </ul>
                                {innerData.isShow ? (
                                  <div
                                    className={`rbt-show-more-btn text-center mb-3 ${
                                      !sectionStates[innerData.subTitle]
                                        ? "active"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      toggleSection(innerData.subTitle)
                                    }
                                  >
                                    Arată toate{" "}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="pricing-footer">
                            <button
                              className={`btn-default ${
                                plan
                                  ? innerData.subTitle.toLowerCase() === plan
                                    ? "color-blacked"
                                    : "btn-border"
                                  : innerData.isSelect
                                  ? "color-blacked"
                                  : "btn-border"
                              } d-block mx-auto`}
                              onClick={() => planSelect(innerData.subTitle)}
                            >
                              Începe
                            </button>
                            <p className="bottom-text">{innerData.limited}</p>
                          </div>
                        </div>
                        {innerData.isSelect && isBadge ? (
                          <div className="feature-badge">Best Offer</div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>

      {alert && <Alert alert={alert} setAlert={setAlert} />}
    </>
  );
};

export default Pricing;
