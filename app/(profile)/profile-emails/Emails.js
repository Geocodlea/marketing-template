"use client";

import React, { useEffect } from "react";
import sal from "sal.js";

import UserNav from "@/components/Common/UserNav";
import { formattedDate } from "@/utils/helpers";
import Stats from "./Stats";

const EmailsPage = ({ emails }) => {
  useEffect(() => {
    sal();
  }, []);

  return (
    <>
      <UserNav title="Emails" />

      {emails && emails.length > 0 && <Stats emailData={emails} />}

      <div className="rainbow-pricing-detailed-area mt--80 mb--80">
        <div className="row row--15">
          <div className="col-lg-12">
            <div className="rainbow-compare-table style-2">
              <table className="table-responsive">
                <thead>
                  <tr>
                    <th></th>
                    <th>To</th>
                    <th>Subiect</th>
                    <th>Data</th>
                    <th>Event</th>
                  </tr>
                </thead>
                <tbody>
                  {emails?.map((email, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{email.email}</td>
                      <td>{email.subject}</td>
                      <td>{formattedDate(email.date)}</td>
                      <td>{email.event}</td>
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
