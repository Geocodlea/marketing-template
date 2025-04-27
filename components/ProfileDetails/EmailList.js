"use client";

import { useState, useEffect } from "react";
import CsvUploader from "@/components/Common/CsvUploader";

const EmailList = ({ userId }) => {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`/api/emails/uploadList/${userId}`);
      const result = await response.json();
      setContacts(result.contacts);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [userId]);

  return (
    <div>
      {contacts?.length > 0 ? (
        <>
          <h5 className="mt-5">Listă de contacte</h5>
          <div className="rainbow-compare-table style-2">
            <table className="table-responsive">
              <thead>
                <tr>
                  <th></th>
                  <th>Email</th>
                  <th>Prenume</th>
                  <th>Nume Familie</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{contact.email}</td>
                    <td>{contact.prenume}</td>
                    <td>{contact.nume_familie}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="mt-5">Nu există contacte momentan.</p>
      )}

      <p className="my-5">
        Pentru a adăuga sau modifica lista de contacte, adaugă un fișier CSV de
        forma:
        <br />
        <a
          href="/downloads/exemplu.csv"
          download
          className="text-blue-500 text-sm"
        >
          <i className="fa-sharp fa-solid fa-download me-2"></i>Download fișier
          exemplu (.csv)
        </a>
      </p>

      <CsvUploader
        api={`/api/emails/uploadList/${userId}`}
        onUploadSuccess={fetchContacts}
      />
    </div>
  );
};

export default EmailList;
