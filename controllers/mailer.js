const { EMAIL_API_KEY } = require("../config");

const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = EMAIL_API_KEY;

const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

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
