"use client";

import Context from "@/context/Context";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopUpMobileMenu";
import PrivacyPolicy from "@/components/PrivacyPolicy/PrivacyPolicy";

const TermsPolicyPage = () => {
  return (
    <>
      <main className="page-wrapper rbt-dashboard-page">
        <Context>
          <div className="rbt-panel-wrapper">
            <HeaderDashboard display="d-none" />
            <PopupMobileMenu />

            <PrivacyPolicy />
          </div>
        </Context>
      </main>
    </>
  );
};

export default TermsPolicyPage;
