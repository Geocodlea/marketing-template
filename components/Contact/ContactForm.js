import React from "react";

const ContactForm = () => {
  return (
    <>
      <form action="#" className="rbt-profile-row rbt-default-form row row--15">
        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
          <div className="form-group">
            <label htmlFor="name">Nume</label>
            <input id="name" type="text" placeholder="Fazlay" />
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="text" placeholder="Rafi" />
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
          <div className="form-group">
            <label htmlFor="tel">Număr de telefon</label>
            <input id="tel" type="tel" placeholder="+1-202-555-0174" />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="message">Mesaj</label>
            <textarea
              id="message"
              cols="20"
              rows="5"
              placeholder="Sunt Front-End Developer pentru #Rainbow IT în Bangladesh, OR. Am o pasiune serioasă pentru efecte UI, animații și crearea unor experiențe dinamice și intuitive pentru utilizatori."
            ></textarea>
          </div>
        </div>
        <div className="col-12 mt--20">
          <div className="form-group mb--0">
            <a className="btn-default" href="#">
              Contactează-ne
            </a>
          </div>
        </div>
      </form>
    </>
  );
};

export default ContactForm;
