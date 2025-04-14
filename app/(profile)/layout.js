"use client";

import Context from "@/context/Context";
import BackToTop from "@/components/Common/BackToTop";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopUpMobileMenu";
import Footer from "@/components/Footers/Footer";
import Copyright from "@/components/Footers/Copyright";

const ProfileLayout = ({ children }) => {
  return (
    <Context>
      <HeaderDashboard display="d-none" />
      <PopupMobileMenu />

      <div className="rbt-main-content mb-0">
        <div className="rbt-daynamic-page-content center-width">
          <div className="rbt-dashboard-content">{children}</div>
        </div>
      </div>

      <BackToTop />
      <Footer />
      <Copyright />
    </Context>
  );
};

export default ProfileLayout;
