const { EMAIL_API_KEY } = require("../config");

const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = EMAIL_API_KEY;

/*
const nodemailer = require("nodemailer");

const sendinBlueTransport = require("nodemailer-sendinblue-transport");
const transporter = nodemailer.createTransport(
  new sendinBlueTransport({
    apiKey: EMAIL_API_KEY,
  })
);
*/




const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;
/*
    try {
      const mailOptions = {
        from: "login.portal@gmail.com",
        to: userEmail,
        subject: subject,
        text: text,
      };

      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.log(EMAIL_API_KEY);
      console.error("Error sending email: " + error);
    }

*/


  // otp-code is in text okkk!!!

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sender = {
    email: `login.portal@gmail.com`,
    name: "No-Reply",
  };

  const receiver = [
    {
      email: userEmail,
    },
  ];

  try {
    const sendEmail = await apiInstance.sendTransacEmail({
      sender,
      to: receiver,
      subject: subject || "Signup Successful!!",
      textContent: "Text Content",
      htmlContent: text,
    });

    // sendEmail()
    //   .then(() => {
    //     return res.status(200).send({ msg: "Email sent successfully!" });
    //   })
    //   .catch((error) => res.status(500).send({ error }));
    // return res.status(200).send({ msg: "Email sent successfully!" });
    return res.status(200).send(sendEmail);
  } catch (error) {
    // console.log(error);
    // return res.status(500).send({ error });
    return res.status(500).send(error);
  }
  
};

module.exports = registerMail;


/*
const nodemailer = require('nodemailer');
const {apiKey}=require('../config/sendInBlue.json');

const sendinBlueTransport = require('nodemailer-sendinblue-transport');
const transporter = nodemailer.createTransport(
    new sendinBlueTransport({
        apiKey: apiKey
    })
);

async function sendEmail(receiver, subject, msg) {
    try {
        const mailOptions = {
            from: 'sonkum236@gmail.com',
            to: receiver,
            subject: subject,
            text: msg
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error('Error sending email: ' + error);
    }
}


module.exports={sendEmail};

*/