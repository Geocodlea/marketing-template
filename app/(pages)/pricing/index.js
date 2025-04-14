"use client";

import { useEffect } from "react";
import Sal from "sal.js";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Pricing from "@/components/Pricing/Pricing";
import Compare from "@/components/Pricing/Compare";

const PricingPage = ({ plan }) => {
  useEffect(() => {
    Sal();
  }, []);

  return (
    <>
      <Breadcrumb
        title="Alege planul potrivit pentru afacerea ta"
        text="Prețuri"
      />

      <div className="rainbow-pricing-area rainbow-section-gap">
        <div className="container">
          <div className="section-title text-center">
            <h4 className="subtitle">
              <span className="theme-gradient">Planuri de abonament</span>
            </h4>
            <h2 className="title w-600 mb--20">
              Alege planul potrivit pentru afacerea ta
            </h2>
            <p className="description b1">
              Testează gratuit primele 3 reclame sau optează pentru un plan
              avansat.
            </p>
          </div>

          <div className="row justify-content-center">
            <Pricing
              parentClass="col-xl-4 col-lg-6 col-md-6 col-12 mt--30"
              start={0}
              end={3}
              plan={plan}
            />
          </div>
        </div>

        <div className="rainbow-pricing-detailed-area rainbow-section-gap">
          <div className="container">
            <Compare
              titleType={true}
              postion="center"
              title="Compară planurile & funcționalitățile"
              subTitle="Comparare Prețuri"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
