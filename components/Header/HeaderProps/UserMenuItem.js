"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UserMenuItems = ({ parentClass }) => {
  const pathname = usePathname();
  const isActive = (href) => pathname.startsWith(href);
  return (
    <>
      <ul className={parentClass}>
        <li>
          <Link
            className={isActive("/profile-details") ? "active" : ""}
            href="/profile-details"
          >
            <i className="fa-sharp fa-regular fa-user"></i>
            <span>Detalii Profil</span>
          </Link>
        </li>
        <li>
          <Link className={isActive("/ads") ? "active" : ""} href="/ads">
            <i className="fab fa-facebook-f"></i>
            <span>Reclame Facebook</span>
          </Link>
        </li>
        <li>
          <Link
            className={isActive("/notification") ? "active" : ""}
            href="/notification"
          >
            <i className="fa-sharp fa-regular fa-shopping-bag"></i>
            <span>Notificări</span>
          </Link>
        </li>
        <li>
          <Link
            className={isActive("/plans-billing") ? "active" : ""}
            href="/plans-billing"
          >
            <i className="fa-sharp fa-regular fa-briefcase"></i>
            <span>Planuri și Abonamente</span>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default UserMenuItems;
