"use client";

import Context from "@/context/Context";
import BackToTop from "@/components/Common/BackToTop";

import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopUpMobileMenu";

const ProfileLayout = ({ children }) => {
  return (
    <Context>
      <HeaderDashboard />
      <PopupMobileMenu />
      {children}

      <BackToTop />
    </Context>
  );
};

export default ProfileLayout;
