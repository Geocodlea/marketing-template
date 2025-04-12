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

      {children}

      <BackToTop />
      <Footer />
      <Copyright />
    </Context>
  );
};

export default ProfileLayout;
