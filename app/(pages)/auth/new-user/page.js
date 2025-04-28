import Link from "next/link";

export const metadata = {
  title: "Bine ai venit!",
  description:
    "Te-ai conectat cu succes la contul tău. Descoperă funcțiile și resursele disponibile pe platforma noastră pentru a profita de toate beneficiile oferite.",
};

export default function NewUser() {
  return (
    <div className="rbt-main-content my-0">
      <div className="rbt-daynamic-page-content center-width">
        <div className="rbt-dashboard-content rainbow-section-gap">
          <div className="d-flex flex-column gap-4 text-center">
            <div className="banner-area"></div>

            <h2 className="mb-3">Bine ai venit în aplicația noastră!</h2>

            <p className="mb-3">
              Ne bucurăm să te avem alături! Pentru a beneficia de toate
              funcționalitățile aplicației și pentru a avea o experiență
              completă, te rugăm să îți completezi profilul.
            </p>

            <Link href="/profile-details" className="btn btn-default mx-auto">
              Completează profilul
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
