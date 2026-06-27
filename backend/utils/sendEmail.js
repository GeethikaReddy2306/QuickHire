const { SendEmailCommand } = require("@aws-sdk/client-ses");
const sesClient = require("../config/ses");

async function sendEmail(to, subject, html) {
  try {
    const params = {
      Source: process.env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Data: html,
          },
          Text: {
            Data: html.replace(/<[^>]*>?/gm, ""),
          },
        },
      },
    };

    const command = new SendEmailCommand(params);

    const result = await sesClient.send(command);

    return result;
  } catch (err) {
    console.error("sendEmail error:", err);
    throw err;
  }
}

module.exports = sendEmail;