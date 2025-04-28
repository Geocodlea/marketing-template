import FooterData from "../../data/footer.json";
import FooterProps from "./FooterProps";

import Newsletter from "./Newsletter";

const Footer = () => {
  return (
    <>
      <footer className="rainbow-footer footer-style-default footer-style-3 position-relative">
        <div className="footer-top">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                <Newsletter />
              </div>

              <div className="col-lg-2 col-md-6 col-sm-6 col-12">
                {FooterData &&
                  FooterData.footer.map((data, index) => (
                    <div className="rainbow-footer-widget" key={index}>
                      <FooterProps list={data.links} />
                    </div>
                  ))}
              </div>

              <div className="col-lg-2 col-md-6 col-sm-6 col-12">
                {FooterData &&
                  FooterData.footer.map((data, index) => (
                    <div className="rainbow-footer-widget" key={index}>
                      <FooterProps list={data.services} />
                    </div>
                  ))}
              </div>

              <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                {FooterData &&
                  FooterData.footer.map((data, index) => (
                    <div className="rainbow-footer-widget" key={index}>
                      <div className="widget-menu-top">
                        <h4 className="title">Contact</h4>
                        {data.contact.map((inner, i) => (
                          <div className="inner" key={i}>
                            <ul className="footer-link contact-link">
                              <li>
                                <i className="contact-icon fa-regular fa-location-dot"></i>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    inner.location
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {inner.location}
                                </a>
                              </li>
                              <li>
                                <i className="contact-icon fa-sharp fa-regular fa-envelope"></i>
                                <a href={`mailto:${inner.mail}`}>
                                  {inner.mail}
                                </a>
                              </li>
                              <li>
                                <i className="contact-icon fa-regular fa-phone"></i>
                                <a href={`tel:${inner.number}`}>
                                  {inner.number}
                                </a>
                              </li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
