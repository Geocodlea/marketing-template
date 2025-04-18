"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import sal from "sal.js";

import UserNav from "@/components/Common/UserNav";

const EmailsPage = ({ emails }) => {
  useEffect(() => {
    sal();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <>
      <UserNav title="Emails" />

      <div className="rainbow-pricing-detailed-area mb--80">
        <div className="row row--15">
          <div className="col-lg-12">
            <div className="rainbow-compare-table style-2">
              <table className="table-responsive">
                <thead>
                  <tr>
                    <th></th>
                    <th>Email</th>
                    <th>Subiect</th>
                    <th>Data</th>
                    <th style={{ minWidth: "150px" }}>Detalii</th>
                  </tr>
                </thead>
                <tbody>
                  {emails?.map((email, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{email.email}</td>
                      <td>{email.subject}</td>
                      <td>{formatDate(email.date)}</td>
                      <td>
                        <Link
                          href={`/emails/${email.uuid}`}
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

export default EmailsPage;
