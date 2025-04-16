import dbConnect from "./dbConnect";
import User from "@/models/User";

const fullHtml = (emailHtml, footerHtml, unsubscribe) => `
<html>
  <head>
    <style>
    .editor-content {
      width: 100%;
      box-sizing: border-box;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .editor-content a {
      color: #007bff;
      text-decoration: none;
    }
    .editor-content a:hover {
      color: #0056b3;
      text-decoration: underline;
    }
    .editor-content figure img {
      display: block;
      margin: 0 auto;
      max-width: 100%;
      height: auto;
    }
    .editor-content figure {
      margin: 0 auto;
      text-align: center;
    }
    .editor-content figcaption {
      margin-top: 8px;
      font-size: 0.9em;
      color: #666;
    }
    .editor-content .image-style-align-right {
      float: right;
      margin-left: 10px;
    }
    .editor-content .image-style-align-left {
      float: left;
      margin-right: 10px;
    }
    .editor-content .image-style-block-align-left {
      display: block;
      margin: 0 auto 0 0;
    }
    .editor-content .image-style-block-align-right {
      display: block;
      margin: 0 0 0 auto;
    }
    .editor-content::after {
      content: "";
      display: table;
      clear: both;
    }
    .editor-content a.emailButton {
      display: inline-block;
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 3px;
      background-color: #007BFF;
      border: 1px solid #007BFF;
      text-align: center;
    }
    .editor-content a.emailButton:hover {
      background-color: #0056b3;
      border-color: #004494;
    }
    .editor-content a.unsubscribe {
      color: #999999;
    }
    .editor-content a.unsubscribe:hover {
      color: #666666;
      text-decoration: underline;
    }
    </style>
  </head>
  <body>
    <div class="editor-content">
      ${emailHtml}
      <br><br>
      ${footerHtml}
      <img
        src="${process.env.DEPLOYED_URL}/img/logo_color.png"
        alt="Logo"
        width="80"
      />
      ${unsubscribe ? `<br>${unsubscribe}` : ""}
    </div>
  </body>
</html>
`;

// Regular expression for validating email addresses
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Create jwt token with user's email
const token = (email) => jwt.sign({ email }, process.env.NEXTAUTH_SECRET);

const unsubscribe = (email) => {
  const html = `<p>Dacă nu dorești să mai primești aceste emailuri, te poti dezabona folosind următorul link:
  <a href="${process.env.DEPLOYED_URL}/api/unsubscribe/${token(
    email
  )}" class="unsubscribe">unsubscribe</a></p>`;

  const text = convert(html, {
    wordwrap: 130,
  });

  return { html, text };
};

const sendTransactionalEmail = async (from, to, subject, body) => {
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: from,
        name: "AI Marketing",
      },
      to: [{ email: to }],
      subject,
      htmlContent: body,
      trackOpens: true, // Enable open tracking
      trackClicks: true, // Enable click tracking
    }),
  });
};

const testEmail = async (from, to, subject, body) => {
  try {
    await sendTransactionalEmail(from, to, subject, body);
  } catch (error) {
    console.error(error);
  }
};

const newsletterEmails = async (type) => {
  await dbConnect();
  const users = await User.find({
    [`subscription.${type}`]: true,
  }).select("email");

  const email = await Email.findOne({ name: type });
  const emailSubject = email.subject;
  const emailHtml = email.body.replace(
    /<p([^>]*)>/g,
    '<p style="margin: 0; padding: 0;" $1>'
  );
  const emailText = convert(emailHtml, {
    wordwrap: 130,
  });

  const { footerHtml, footerText } = await emailFooter();

  await Promise.all(
    users.map(async (user) => {
      try {
        await sendTransactionalEmail(
          user.email,
          emailSubject,
          fullHtml(emailHtml, footerHtml, unsubscribe(user.email).html),
          `${emailText}\n\n${footerText}\n\n${unsubscribe(user.email).text}`
        );
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            type: "email",
          },
          extra: {
            message: "Failed to send newsletter email",
            type,
            userEmail: user.email,
          },
        });
      }
    })
  );
};

const inactiveEmails = async (userEmails, deletionDate, loginLink) => {
  await dbConnect();
  const email = await Email.findOne({ name: "inactive" });
  const emailSubject = email.subject;
  const emailHtml = email.body
    .replace(/{deletionDate}/g, deletionDate)
    .replace(
      "{loginButton}",
      `<a
      href="${loginLink}"
      target="_blank"
      class="emailButton"
    >
      Conectează-te la contul tău
    </a>`
    )
    .replace(/<p([^>]*)>/g, '<p style="margin: 0; padding: 0;" $1>');
  const emailText = convert(emailHtml, {
    wordwrap: 130,
  });

  const { footerHtml, footerText } = await emailFooter();

  await Promise.all(
    userEmails.map(async (userEmail) => {
      try {
        await sendTransactionalEmail(
          userEmail,
          emailSubject,
          fullHtml(emailHtml, footerHtml),
          `${emailText}\n\n${footerText}`
        );
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            type: "email",
          },
          extra: {
            message: "Failed to send inactive email",
            userEmail,
          },
        });
      }
    })
  );
};

const contactEmail = async (data) => {
  try {
    const emailHtml = `<p>${data.message}<br /><br />
                    Trimis de: ${data.name}<br />
                    Email: <a href="mailto:${data.email}">${data.email}</a><br />
                    Telefon: <a href="tel:${data.phone}">${data.phone}</p>`;
    const emailText = convert(emailHtml, {
      wordwrap: 130,
    });

    await adminTransporter.sendMail({
      from: process.env.GOOGLE_EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Mesaj de pe formular contact AGames`,
      text: emailText,
      html: emailHtml,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        type: "email",
      },
      extra: {
        message: "Failed to send contact email to admin",
        data,
      },
    });
  }
};

const emailFooter = async () => {
  await dbConnect();
  const email = await Email.findOne({ name: "footer" });
  const footerHtml = email.body.replace(
    /<p([^>]*)>/g,
    '<p style="margin: 0; padding: 0;" $1>'
  );

  const footerText = convert(footerHtml, {
    wordwrap: 130,
  });

  return { footerHtml, footerText };
};

export { testEmail };
