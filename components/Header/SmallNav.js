import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import SmallNavItem from "../../data/header.json";

const SmallNav = () => {
  const pathname = usePathname();

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
                          <Link href={data.link}>
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
      </nav>
    </>
  );
};

export default SmallNav;
