"use client";

import React from "react";
import Context from "@/context/Context";

import Header from "@/components/Header/Header";
import PopupMobileMenu from "@/components/Header/PopUpMobileMenu";
import Footer from "@/components/Footers/Footer";
import Copyright from "@/components/Footers/Copyright";

const PagesLayout = ({ children }) => {
  return (
    <>
      <main className="page-wrapper">
        <Context>
          <Header
            headerTransparent="header-transparent"
            headerSticky="header-sticky"
            btnClass="rainbow-gradient-btn"
          />
          <PopupMobileMenu />

          {children}

          <Footer />
          <Copyright />
        </Context>
      </main>
    </>
  );
};

export default PagesLayout;
