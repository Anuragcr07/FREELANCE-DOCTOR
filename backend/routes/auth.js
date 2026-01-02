import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../models/User.js';

const router = express.Router();

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Log to your terminal to verify variables are loading
    console.log("Attempting signup for:", email);
    console.log("Using Email User:", process.env.EMAIL_USER);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ message: "Backend config error: EMAIL_USER or EMAIL_PASS missing." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');

    const newUser = new User({ name, email, password: hashedPassword, verificationToken: token });
    await newUser.save();

    // 2. Define Transporter INSIDE the route to ensure .env is loaded
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const frontendUrl ="http://localhost:5173";
    const url = `${frontendUrl}/verify-email/${token}`;

    await transporter.sendMail({
      to: email,
      subject: 'Verify your Med-Manager Account',
      html: `<h3>Welcome to Med-Manager</h3><p>Please click <a href="${url}">here</a> to verify your account.</p>`
    });

    res.status(201).json({ message: "Verification email sent! Check your inbox." });

  } catch (err) {
    console.error("SIGNUP ERROR:", err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(401).json({ message: "Please verify email first" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, result: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// VERIFY EMAIL ROUTE
router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({ message: "Verified successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Verification error" });
  }
});

export default router;