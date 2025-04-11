"use client";

import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopUpMobileMenu";
import LeftDashboardSidebar from "@/components/Header/LeftDashboardSidebar";
import PlansBilling from "@/components/PlansBilling/PlansBilling";
import BackToTop from "../backToTop";

const PlansBillingPage = ({ plan, planExpiresAt, paymentStatus }) => {
  return (
    <>
      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="d-none" />

            <PopupMobileMenu />
            <LeftDashboardSidebar />

            <PlansBilling
              plan={plan}
              planExpiresAt={planExpiresAt}
              paymentStatus={paymentStatus}
            />
          </div>

          <BackToTop />
        </Context>
      </main>
    </>
  );
};

export default PlansBillingPage;
