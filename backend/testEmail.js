require("dotenv").config();

const sendEmail = require("./utils/sendEmail");

async function test() {
  try {
    await sendEmail(
    "geethikakotu3@gmail.com",
    "QuickHire Test",
    "<h2>QuickHire AWS SES is working!</h2>"
);

    console.log("Email sent successfully");
  } catch (err) {
    console.error(err);
  }
}

test();