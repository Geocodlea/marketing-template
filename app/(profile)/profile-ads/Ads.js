"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import sal from "sal.js";

import { formattedDate } from "@/utils/helpers";

import UserNav from "@/components/Common/UserNav";

const AdsPage = ({ ads }) => {
  useEffect(() => {
    sal();
  }, []);

  return (
    <>
      <UserNav title="Reclame Facebook" />

      <div className="rainbow-pricing-detailed-area mb--80">
        <div className="row row--15">
          <div className="col-lg-12">
            <div className="rainbow-compare-table style-2">
              <table className="table-responsive">
                <thead>
                  <tr>
                    <th></th>
                    <th>Nume</th>
                    <th>Status</th>
                    <th>Vârstă Țintită</th>
                    <th>Creat</th>
                    <th style={{ minWidth: "150px" }}>Detalii</th>
                  </tr>
                </thead>
                <tbody>
                  {ads?.map((ad, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{ad.name}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              ad.effective_status === "ACTIVE"
                                ? "var(--color-primary)"
                                : "var(--color-gray)",
                            color: "#fff",
                            padding: "10px",
                          }}
                        >
                          {ad.effective_status}
                        </span>
                      </td>
                      <td>
                        {ad.targeting?.age_min} – {ad.targeting?.age_max}
                      </td>
                      <td>{formattedDate(ad.created_time)}</td>
                      <td>
                        <Link
                          href={`/profile-ads/${ad.id}`}
                          className="read-more-btn theme-gradient"
                        >
                          Vezi
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdsPage;
