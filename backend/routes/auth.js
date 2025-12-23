const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const crypto = require('crypto');

// Nodemailer Setup (Use Gmail or Mailtrap for testing)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');

    const newUser = new User({ name, email, password: hashedPassword, verificationToken: token });
    await newUser.save();

    const url = `http://localhost:3000/verify/${token}`;
    await transporter.sendMail({
      to: email,
      subject: 'Verify your Med-Manager Account',
      html: `<h3>Welcome to Med-Manager</h3><p>Click <a href="${url}">here</a> to verify your email.</p>`
    });

    res.status(201).json({ message: "Verification email sent!" });
  } catch (err) { res.status(500).json(err); }
});

// VERIFY EMAIL
router.get('/verify/:token', async (req, res) => {
  const user = await User.findOne({ verificationToken: req.params.token });
  if (!user) return res.status(400).send("Invalid token");

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
  res.send("Email verified successfully! You can now login.");
});

// LOGIN
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("User not found");
  if (!user.isVerified) return res.status(401).send("Please verify your email first");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { name: user.name, email: user.email } });
});

module.exports = router;