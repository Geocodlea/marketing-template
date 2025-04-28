import Link from "next/link";

export const metadata = {
  title: "Verifică-ți emailul",
  description:
    "Am trimis un link de conectare la adresa ta de email. Te rugăm să îți verifici inboxul pentru a continua procesul.",
};

export default function VerifyRequest() {
  return (
    <div className="rbt-main-content my-0">
      <div className="rbt-daynamic-page-content center-width">
        <div className="rbt-dashboard-content rainbow-section-gap">
          <div className="d-flex flex-column gap-4 text-center">
            <div className="banner-area"></div>

            <h3 className="mb-3">Te rugăm să îți verifici emailul</h3>

            <p className="mb-3">
              Un link de conectare a fost trimis la adresa ta
            </p>

            <Link href="/" className="btn btn-default mx-auto">
              Întoarce-te la pagina principală
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
