"use server";

import nodemailer from "nodemailer";
import { convert } from "html-to-text";

// Create a transporter with Gmail
const adminTransporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL_USER,
    pass: process.env.GOOGLE_EMAIL_PASS,
  },
});

export async function contact(data) {
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

    return {
      status: "success",
      message: "Mesajul a fost trimis cu succes!",
    };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return {
      status: "danger",
      message: "A apărut o eroare. Vă rugăm să încercați mai târziu.",
    };
  }
}
