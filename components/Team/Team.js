"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Sal from "sal.js";

import TeamData from "../../data/team.json";

const Team = () => {
  useEffect(() => {
    Sal();
  }, []);

  return (
    <>
      <div className="rbt-team-area bg-color-1 rainbow-section-gap-big pb--0">
        <div className="container">
          <div className="section-title text-center">
            <h4 className="subtitle">
              <span className="theme-gradient">Despre Noi</span>
            </h4>
            <h2 className="title w-600 mb--20">Povestea Noastră</h2>
            <p className="description b1">
              Am creat această platformă pentru a face publicitatea pe Facebook
              accesibilă tuturor. Ne-am dorit să oferim o soluție simplă și
              eficientă pentru afacerile care vor să crească rapid.
            </p>
          </div>
        </div>
      </div>

      <div className="rbt-team-area bg-color-1 rainbow-section-gap-big">
        <div className="container">
          <div className="row mb--60">
            <div className="col-lg-12">
              <div className="section-title text-center">
                <h4 className="subtitle">
                  <span className="theme-gradient">Echipa Noastră</span>
                </h4>
                <h2 className="title w-600 mb--20">
                  Oameni cu experiență, dedicați succesului tău
                </h2>
              </div>
            </div>
          </div>

          <div className="row row--15 mt_dec--30">
            {TeamData &&
              TeamData.team.slice(0, 6).map((data, index) => (
                <div
                  className="col-lg-4 col-md-6 col-sm-6 col-12 mt--30"
                  key={index}
                >
                  <div className="team">
                    <div className="thumbnail">
                      <Image
                        src={data.img}
                        width={415}
                        height={352}
                        alt="Team Member"
                      />
                    </div>
                    <div className="content">
                      <h4 className="title">{data.name}</h4>
                      <p className="designation">{data.profission}</p>
                      <p className="description">{data.description}</p>
                    </div>
                    <ul className="social-icon">
                      <li>
                        <a href="#">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-twitter"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="rbt-team-area bg-color-1 rainbow-section-gap-big">
        <div className="container text-center">
          <h2 className="title w-600 mb--20">Misiunea Noastră</h2>
          <p className="description b1">
            Facem publicitatea pe Facebook accesibilă tuturor, oferind soluții
            automatizate și eficiente care economisesc timp și bani.
          </p>
        </div>
      </div>
    </>
  );
};

export default Team;
