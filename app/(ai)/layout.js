import Context from "@/context/Context";
import BackToTop from "@/components/Common/BackToTop";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import PopupMobileMenu from "@/components/Header/PopUpMobileMenu";

const AILayout = async ({ children }) => {
  return (
    <Context>
      <HeaderDashboard />
      <PopupMobileMenu />

      <div className="rbt-main-content">
        <div className="rbt-daynamic-page-content">
          <div className="rbt-dashboard-content">
            <div className="content-page">{children}</div>
          </div>
        </div>
      </div>

      <BackToTop />
    </Context>
  );
};

export default AILayout;
