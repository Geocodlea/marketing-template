"use client";

import dynamic from "next/dynamic";
const HashTab = dynamic(() => import("@/components/Common/HashTab"), {
  ssr: false,
});

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Alert from "@/components/Common/Alert";

import ProfileForm from "./ProfileForm";
import FbForm from "./FbForm";
import EmailForm from "./EmailForm";
import DeleteForm from "./DeleteForm";

const ProfileBody = ({ userData }) => {
  const [alert, setAlert] = useState(null);
  const [dnsRecords, setDnsRecords] = useState([]);
  const user = JSON.parse(userData);

  const updateAccount = async (accountDetails) => {
    if (accountDetails.brevoEmail) {
      try {
        const response = await fetch(
          `/api/emails/brevo/${accountDetails.brevoEmail}`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          setAlert({
            status: "danger",
            message: `A apărut o eroare. Încercați mai târziu.`,
          });
          return;
        }

        const data = await response.json();
        setDnsRecords(data.dnsRecords);
      } catch (error) {
        setAlert({
          status: "danger",
          message: `A apărut o eroare: ${error.message}`,
        });
        return;
      }
    }

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        body: JSON.stringify({ accountDetails }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert(data);
      } else {
        setAlert(data);
      }
    } catch (error) {
      setAlert({
        status: "danger",
        message: `A apărut o eroare: ${error.message}`,
      });
    }
  };

  const deleteAccount = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setAlert(data);
        signOut({ callbackUrl: "/" });
      } else {
        setAlert(data);
      }
    } catch (error) {
      setAlert({
        status: "danger",
        message: `A apărut o eroare: ${error.message}`,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/emails/brevo/${user.brevo?.email}`);
      const data = await response.json();
      setDnsRecords(data.dnsRecords);
    };

    fetchData();
  }, [user.brevo?.email]);

  return (
    <>
      <div className="single-settings-box profile-details-box overflow-hidden">
        <div className="profile-details-tab">
          <div className="advance-tab-button mb--30">
            <ul
              className="nav nav-tabs tab-button-style-2 justify-content-start"
              id="settinsTab-4"
              role="tablist"
            >
              <li role="presentation">
                <a
                  href="#"
                  className="tab-button active"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="true"
                >
                  <span className="title">Profil</span>
                </a>
              </li>

              <li role="presentation">
                <a
                  href="#"
                  className="tab-button"
                  id="fb-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#fb"
                  role="tab"
                  aria-controls="fb"
                  aria-selected="false"
                >
                  <span className="title">Setup Facebook</span>
                </a>
              </li>

              <li role="presentation">
                <a
                  href="#"
                  className="tab-button"
                  id="email-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#email"
                  role="tab"
                  aria-controls="email"
                  aria-selected="false"
                >
                  <span className="title">Setup Email</span>
                </a>
              </li>

              <li role="presentation">
                <a
                  href="#"
                  className="tab-button"
                  id="del-account-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#delaccount"
                  role="tab"
                  aria-controls="delaccount"
                  aria-selected="false"
                >
                  <span className="title">Șterge Contul</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="tab-content">
            <ProfileForm user={user} updateAccount={updateAccount} />
            <FbForm user={user} updateAccount={updateAccount} />
            <EmailForm
              user={user}
              updateAccount={updateAccount}
              dnsRecords={dnsRecords}
            />
            <DeleteForm deleteAccount={deleteAccount} />
          </div>

          <HashTab />
          {alert && <Alert alert={alert} setAlert={setAlert} />}
        </div>
      </div>
    </>
  );
};

export default ProfileBody;
