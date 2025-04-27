"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import Alert from "@/components/Common/Alert";

export default function CsvUploader({ api, onUploadSuccess }) {
  const [alert, setAlert] = useState(null);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles || acceptedFiles.length === 0) {
        setAlert({
          status: "danger",
          message: "Doar fișiere CSV sunt acceptate.",
        });
        return;
      }

      const file = acceptedFiles[0];

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          try {
            const res = await fetch(api, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(results.data),
            });

            const data = await res.json();
            setAlert(data);

            // ✅ Call onUploadSuccess after successful upload
            if (res.ok && typeof onUploadSuccess === "function") {
              onUploadSuccess();
            }
          } catch (error) {
            console.error("Upload failed", error);
            setAlert({
              status: "danger",
              message: "Eroare la upload.",
            });
          }
        },
      });
    },
    [api, onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border border-2 border-secondary border-dashed rounded p-5 text-center d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "200px", cursor: "pointer" }}
    >
      <input {...getInputProps()} />
      <div className="mb-3">
        <i
          className="bi bi-cloud-arrow-up"
          style={{ fontSize: "3rem", color: "#6c757d" }}
        ></i>
      </div>
      {isDragActive ? (
        <p>Drop the file here...</p>
      ) : (
        <>
          <p className="fw-bold">
            Select your CSV file or drag and drop it here
          </p>
          <i
            className="fa-sharp fa-solid fa-cloud-arrow-up mb-5"
            style={{ fontSize: "80px" }}
          ></i>
          <p className="small">Accepted format: .csv</p>
        </>
      )}
      {alert && <Alert alert={alert} setAlert={setAlert} />}
    </div>
  );
}
