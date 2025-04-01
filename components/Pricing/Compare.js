"use client";

import React, { useEffect } from "react";
import sal from "sal.js";

const Compare = ({ subTitle, title, postion, titleType }) => {
  useEffect(() => {
    sal();
  }, []);
  return (
    <div className="rainbow-pricing-detailed-area mt--60">
      <div className="row">
        <div className="col-lg-12">
          <div
            className={`section-title text-${postion} mb--30`}
            data-sal="slide-up"
            data-sal-duration="400"
            data-sal-delay="150"
          >
            {subTitle ? (
              <h4 className="subtitle">
                <span className="theme-gradient">{subTitle}</span>
              </h4>
            ) : (
              ""
            )}
            {titleType ? (
              <h2 className="title w-600 mb--0">{title}</h2>
            ) : (
              <h3 className="title w-600 mb--0">{title}</h3>
            )}
          </div>
        </div>
      </div>
      <div className="row row--15">
        <div className="col-lg-12">
          <div className="rainbow-compare-table style-1">
            <table className="table-responsive">
              <thead>
                <tr>
                  <th></th>
                  <th className="sm-radius-top-left">Gratuit</th>
                  <th className="style-prymary">De Bază</th>
                  <th className="style-prymary">Avansat</th>
                  <th className="style-prymary sm-radius-top-right">
                    Întreprindere
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="heading-row">
                  <td>
                    <h6>Planuri și Prețuri</h6>
                  </td>
                  <td>
                    <h6>Planuri și Prețuri</h6>
                  </td>
                  <td>
                    <h6>Planuri și Prețuri</h6>
                  </td>
                  <td>
                    <h6>Planuri și Prețuri</h6>
                  </td>
                  <td>
                    <h6>Planuri și Prețuri</h6>
                  </td>
                </tr>
                <tr>
                  <td>Testează Gratuit</td>
                  <td>Primele 3 reclame</td>
                  <td>50€/lună</td>
                  <td>200€/lună</td>
                  <td>Personalizabil</td>
                </tr>
                <tr>
                  <td>Reclame Generate de AI</td>
                  <td>Incluse</td>
                  <td>Incluse</td>
                  <td>Incluse</td>
                  <td>Incluse</td>
                </tr>
                <tr>
                  <td>Optimizare Automată</td>
                  <td>Limitată</td>
                  <td>Standard</td>
                  <td>Avansată</td>
                  <td>Personalizabilă</td>
                </tr>
                <tr>
                  <td>Rapoarte Detaliate</td>
                  <td>
                    <span className="icon bg-dark">
                      <i className="feather-x"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                </tr>
                <tr className="heading-row">
                  <td>
                    <h6>Beneficii</h6>
                  </td>
                  <td>
                    <h6>Beneficii</h6>
                  </td>
                  <td>
                    <h6>Beneficii</h6>
                  </td>
                  <td>
                    <h6>Beneficii</h6>
                  </td>
                  <td>
                    <h6>Beneficii</h6>
                  </td>
                </tr>
                <tr>
                  <td>Cost mai mic decât agențiile</td>
                  <td>Da</td>
                  <td>Da</td>
                  <td>Da</td>
                  <td>Da</td>
                </tr>
                <tr>
                  <td>Optimizare bazată pe performanță</td>
                  <td>Limitată</td>
                  <td>Standard</td>
                  <td>Avansată</td>
                  <td>Personalizabilă</td>
                </tr>
                <tr>
                  <td>Garanție de Satisfacție</td>
                  <td>14 zile</td>
                  <td>14 zile</td>
                  <td>14 zile</td>
                  <td>14 zile</td>
                </tr>
                <tr className="heading-row">
                  <td>
                    <h6>Funcționalități</h6>
                  </td>
                  <td>
                    <h6>Funcționalități</h6>
                  </td>
                  <td>
                    <h6>Funcționalități</h6>
                  </td>
                  <td>
                    <h6>Funcționalități</h6>
                  </td>
                  <td>
                    <h6>Funcționalități</h6>
                  </td>
                </tr>
                <tr>
                  <td>Creare rapidă a campaniilor</td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Monitorizare în timp real</td>
                  <td>
                    <span className="icon bg-dark">
                      <i className="feather-x"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Recomandări de optimizare AI</td>
                  <td>
                    <span className="icon bg-dark">
                      <i className="feather-x"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Istoricul campaniilor</td>
                  <td>
                    <span className="icon bg-dark">
                      <i className="feather-x"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                  <td>
                    <span className="icon">
                      <i className="feather-check"></i>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;
