"use server";

import nodemailer from "nodemailer";
import { convert } from "html-to-text";
import { redirect } from "next/navigation";

// Create a transporter with Gmail
const adminTransporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL_USER,
    pass: process.env.GOOGLE_EMAIL_PASS,
  },
});

export async function contact(formData) {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    tel: formData.get("tel"),
    message: formData.get("message"),
  };

  try {
    const emailHtml = `<p>${data.message}<br /><br />
                            Trimis de: ${data.name}<br />
                            Email: <a href="mailto:${data.email}">${data.email}</a><br />
                            Telefon: <a href="tel:${data.tel}">${data.tel}</p>`;
    const emailText = convert(emailHtml, {
      wordwrap: 130,
    });

    await adminTransporter.sendMail({
      from: process.env.GOOGLE_EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Mesaj de pe formularul contact`,
      text: emailText,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
  }

  redirect("/contact");
}
