"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import avatar from "../../public/images/team/team-01sm.jpg";

import SmallNavItem from "../../data/header.json";
import { useAppContext } from "@/context/Context";

import { useSession } from "next-auth/react";

const LeftSidebar = () => {
  const pathname = usePathname();
  const { shouldCollapseLeftbar } = useAppContext();
  const { data: session } = useSession();

  const isActive = (href) => pathname.startsWith(href);
  return (
    <>
      <div
        className={`rbt-left-panel popup-dashboardleft-section ${
          shouldCollapseLeftbar ? "collapsed" : ""
        }`}
      >
        <div className="rbt-default-sidebar">
          <div className="inner">
            <div className="content-item-content">
              <div className="rbt-default-sidebar-wrapper">
                <nav className="mainmenu-nav">
                  <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                    {SmallNavItem &&
                      SmallNavItem.smallNavItem
                        .slice(0, 5)
                        .map((data, index) => (
                          <li key={index}>
                            <Link
                              className={
                                isActive(data.link)
                                  ? "active"
                                  : "" || data.isDisable
                                  ? "disabled"
                                  : ""
                              }
                              href={data.link}
                            >
                              <Image
                                src={data.img}
                                width={35}
                                height={35}
                                alt="AI Generator"
                              />
                              <span>{data.text}</span>
                              {data.badge !== "" ? (
                                <div className="rainbow-badge-card badge-sm ml--10">
                                  {data.badge}
                                </div>
                              ) : (
                                ""
                              )}
                            </Link>
                          </li>
                        ))}
                  </ul>
                  <div className="rbt-sm-separator"></div>
                  <div className="mainmenu-nav">
                    <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                      <li className="has-submenu">
                        <a
                          className="collapse-btn collapsed"
                          data-bs-toggle="collapse"
                          href="#collapseExampleMenu"
                          role="button"
                          aria-expanded="false"
                          aria-controls="collapseExampleMenu"
                        >
                          <i className="feather-plus-circle"></i>
                          <span>Settings</span>
                        </a>
                        <div className="collapse" id="collapseExampleMenu">
                          <ul className="submenu rbt-default-sidebar-list">
                            {SmallNavItem &&
                              SmallNavItem.smallNavItem
                                .slice(5, 14)
                                .map((data, index) => (
                                  <li key={index}>
                                    <Link
                                      href={data.link}
                                      className={
                                        isActive(data.link) ? "active" : ""
                                      }
                                    >
                                      <i className={`feather-${data.icon}`}></i>
                                      <span>{data.text}</span>
                                    </Link>
                                  </li>
                                ))}
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="rbt-sm-separator"></div>

                  <div className="right-side-top text-center">
                    <a
                      style={{ cursor: "pointer" }}
                      className="btn-default bg-solid-primary d-flex align-items-center justify-content-center gap-2 cursor-pointer"
                      data-bs-toggle="modal"
                      data-bs-target="#newchatModal"
                    >
                      <span className="icon">
                        <i className="feather-plus-circle"></i>
                      </span>
                      <span>New Chat</span>
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          </div>

          <div className="subscription-box">
            <div className="inner">
              <Link href="/profile-details" className="autor-info">
                <div className="author-img active">
                  <Image
                    className="w-100"
                    width={49}
                    height={48}
                    src={session?.user.image || avatar}
                    alt="Author"
                  />
                </div>
                <div className="author-desc">
                  <h6>{session?.user.name}</h6>
                  <span>{session?.user.email}</span>
                </div>
                <div className="author-badge">Free</div>
              </Link>
              <div className="btn-part">
                <Link href="/pricing" className="btn-default btn-border">
                  Upgrade To Pro
                </Link>
              </div>
            </div>
          </div>
          <p className="subscription-copyright copyright-text text-center b3  small-text">
            © 2024
            <Link
              className="ps-2"
              href="https://themeforest.net/user/rainbow-themes/portfolio"
            >
              Rainbow Themes
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
