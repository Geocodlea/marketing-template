import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SmallNavItem from "../../data/header.json";

import avatar from "../../public/images/team/team-01sm.jpg";
import { useSession } from "next-auth/react";

const SmallNav = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href) => pathname.startsWith(href);
  return (
    <>
      <nav className="mainmenu-nav">
        <ul className="dashboard-mainmenu rbt-default-sidebar-list">
          {SmallNavItem &&
            SmallNavItem.smallNavItem.slice(0, 5).map((data, index) => (
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

        <ul className="submenu rbt-default-sidebar-list">
          {SmallNavItem &&
            SmallNavItem.smallNavItem.slice(5, 8).map((data, index) => (
              <li key={index}>
                <Link href={data.link}>
                  <i className={`feather-${data.icon}`}></i>
                  <span>{data.text}</span>
                </Link>
              </li>
            ))}
        </ul>

        <div className="rbt-sm-separator"></div>

        {session ? (
          <div
            className="subscription-box"
            style={{ position: "relative", bottom: 0 }}
          >
            <div className="inner">
              <Link href="/profile-details" className="autor-info">
                <div className="author-img active">
                  <Image
                    className="w-100"
                    width={49}
                    height={48}
                    src={session?.user.image || avatar}
                    alt="User Images"
                  />
                </div>
                <div className="author-desc">
                  <h6>{session?.user.name}</h6>
                  <span>{session?.user.email}</span>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <ul className="submenu rbt-default-sidebar-list">
            <li>
              <Link href="/signin">
                <i className="feather-user"></i>
                <span>Sign In</span>
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </>
  );
};

export default SmallNav;
