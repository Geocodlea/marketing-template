"use client";

import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import TermsPolicy from "@/components/TermsPolicy/TermsPolicy";
import PopupMobileMenu from "@/components/Header/PopUpMobileMenu";

const TermsPolicyPage = () => {
  return (
    <>
      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="d-none" />
            <PopupMobileMenu />

            <TermsPolicy />
          </div>
        </Context>
      </main>
    </>
  );
};

export default TermsPolicyPage;
