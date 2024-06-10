const nodemailer = require("nodemailer");
const { generator } = require("../generator/generator");
require("dotenv").config();

module.exports.email = async (req, res) => {
  try {
    const generatedCode = await generator(10);
    const { email } = req.body;

    console.log("Generated Code:", generatedCode);
    console.log("Email to send:", email);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      subject: "Verification Code",
      text: `Thank you for registering on Tic Tac Toe - Showdown!\nYour verification code: ${generatedCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email Error:", error);
        return res
          .status(400)
          .json({ msg: "Email Error: " + error.message, status: false });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({ msg: "Email sent!", status: true });
      }
    });
  } catch (error) {
    console.error("Code Generation Error:", error);
    return res
      .status(500)
      .json({ msg: "Code Generation Error: " + error.message, status: false });
  }
};
