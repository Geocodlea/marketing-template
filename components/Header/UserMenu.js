"use client";

import Image from "next/image";
import Link from "next/link";

import avatar from "../../public/images/team/avatar.png";
import UserMenuItems from "./HeaderProps/UserMenuItem";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const UserMenu = () => {
  const { data: session } = useSession();

  return (
    <>
      <div className="inner">
        <div className="rbt-admin-profile">
          <div className="admin-thumbnail">
            <Image
              src={session?.user?.image || avatar}
              width={31}
              height={31}
              alt="User Images"
            />
          </div>
          <div className="admin-info">
            <span className="name">{session?.user?.firstname}</span>
            <Link
              className="rbt-btn-link color-primary"
              href="/profile-details"
            >
              View Profile
            </Link>
          </div>
        </div>
        <UserMenuItems parentClass="user-list-wrapper user-nav" />
        <hr className="mt--10 mb--10" />
        <ul className="user-list-wrapper user-nav">
          <li>
            <Link href="/contact">
              <i className="fa-solid fa-comments-question"></i>
              <span>Contact</span>
            </Link>
          </li>
          <li>
            <Link href="/utilize">
              <i className="fa-sharp fa-solid fa-screwdriver-wrench"></i>
              <span>Utilizare</span>
            </Link>
          </li>
          {/* <li>
            <Link href="/setup">
              <i className="fa-sharp fa-solid fa-gears"></i>
              <span>Setup</span>
            </Link>
          </li> */}
        </ul>
        <hr className="mt--10 mb--10" />
        <ul className="user-list-wrapper">
          <li>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              <i className="fa-sharp fa-solid fa-right-to-bracket"></i>
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default UserMenu;
