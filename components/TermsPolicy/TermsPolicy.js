import Link from "next/link";

const TermsPolicy = () => {
  return (
    <>
      <div className="rbt-main-content mb--0">
        <div className="rbt-daynamic-page-content center-width">
          <div className="rbt-dashboard-content rainbow-section-gap">
            <div className="banner-area">
              <div className="settings-area">
                <h3 className="title">Termeni și Condiții</h3>
              </div>
            </div>
            <div className="content-page">
              <div className="chat-box-list">
                <div className="content">
                  <h4>Termeni și Condiții - AiWave</h4>

                  <h5>1. Introducere</h5>
                  <p>
                    Acești Termeni și Condiții reglementează utilizarea
                    site-ului AiWave și a serviciilor oferite. Prin accesarea
                    sau utilizarea acestora, sunteți de acord cu acești termeni.
                    Dacă nu sunteți de acord cu acești termeni, vă rugăm să nu
                    utilizați site-ul sau serviciile noastre.
                  </p>

                  <h5>2. Datele Colectate</h5>
                  <p>
                    Colectăm informații personale atunci când vizitați site-ul
                    nostru sau utilizați serviciile noastre. Aceste informații
                    pot include numele, adresa de email, numărul de telefon și
                    alte detalii relevante pentru a vă oferi o experiență
                    personalizată.
                    <br />
                    <Link href="https://www.example.com/politica-de-confidentialitate">
                      Citiți Politica de Confidențialitate
                    </Link>
                  </p>

                  <h5>3. Utilizarea Serviciilor</h5>
                  <p>
                    Sunteți responsabil pentru utilizarea corectă a serviciilor
                    noastre. Acestea sunt destinate exclusiv utilizării
                    personale și nu pot fi folosite în scopuri comerciale fără
                    acordul nostru expres.
                  </p>

                  <h5>4. Drepturile Utilizatorilor</h5>
                  <p>
                    Conform legislației în vigoare, utilizatorii au dreptul de a
                    accesa, rectifica sau șterge datele personale pe care le
                    colectăm. Pentru exercitarea acestor drepturi, vă rugăm să
                    ne contactați prin email.
                  </p>

                  <h5>5. Limitarea Răspunderii</h5>
                  <p>
                    AiWave nu poate fi tras la răspundere pentru daune directe
                    sau indirecte care ar putea rezulta din utilizarea
                    serviciilor noastre.
                  </p>

                  <h5>6. Modificări ale Termenilor și Condițiilor</h5>
                  <p>
                    AiWave își rezervă dreptul de a modifica acești termeni
                    oricând, iar modificările vor fi publicate pe această
                    pagină. Vă recomandăm să verificați periodic acești termeni.
                  </p>

                  <h5>7. Legea Aplicabilă</h5>
                  <p>
                    Acești termeni sunt guvernați de legislația română. Orice
                    dispută va fi soluționată de instanțele competente din
                    România.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPolicy;
