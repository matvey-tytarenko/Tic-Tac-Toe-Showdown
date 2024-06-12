const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../Model/UserSchema");
const crypto = require("crypto");
require("dotenv").config();

let pendingUsers = {};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res
        .status(409)
        .json({ msg: "Username already used!", status: false });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res
        .status(409)
        .json({ msg: "Email already used!", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = crypto.randomBytes(4).toString("hex");

    pendingUsers[email] = {
      username,
      email,
      password: hashedPassword,
      verificationCode,
    };

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
      subject: "Email Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email Error:", error);
        return res
          .status(400)
          .json({ msg: "Email Error: " + error.message, status: false });
      } else {
        console.log("Email sent:", info.response);
        return res
          .status(200)
          .json({ msg: "Verification email sent!", status: true });
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, verify } = req.body;
    const pendingUser = pendingUsers[email];

    if (!pendingUser) {
      return res.status(400).json({ msg: "Invalid Email!", status: false });
    }
    if (pendingUser.verificationCode !== verify) {
      return res
        .status(400)
        .json({ msg: "Invalid verification code.", status: false });
    }

    const user = await User.create({
      email: pendingUser.email,
      username: pendingUser.username,
      password: pendingUser.password,
    });
    delete pendingUsers[email];

    return res.status(201).json({status: true, user})
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
   try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Incorrect username or password!", status: false });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(400).json({ msg: "Incorrect username or password!", status: false });
    }

    return res.status(200).json({ status: true, user });
  } catch (error) {
    next(error);
  }
};