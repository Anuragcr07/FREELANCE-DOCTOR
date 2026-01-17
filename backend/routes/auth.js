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

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
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

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found." });

    // 1. Generate plain text token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Hash it and save to DB
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // DEBUG LOG 1
    console.log("----------------------------");
    console.log("FORGOT PASSWORD CALLED");
    console.log("Plain Token sent to email:", resetToken);
    console.log("Hashed Token saved to DB:", hashedToken);

    const resetUrl = `https://freelance-doctor-medical-01.onrender.com/reset-password/${resetToken}`;
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `<h3>MedFlow Password Reset</h3><p>Click <a href="${resetUrl}">here</a> to reset. Link expires in 1 hour.</p>`
    });

    res.json({ message: "Reset link sent to email." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// --- RESET PASSWORD ---
router.post('/reset-password/:token', async (req, res) => {
  try {
    const plainTokenFromUrl = req.params.token;
    
    // 1. Hash the token coming from the URL
    const hashedTokenFromUrl = crypto.createHash('sha256').update(plainTokenFromUrl).digest('hex');

    // DEBUG LOG 2
    console.log("----------------------------");
    console.log("RESET PASSWORD CALLED");
    console.log("Token from URL:", plainTokenFromUrl);
    console.log("Hash of URL Token:", hashedTokenFromUrl);

    // 2. Search for user with matching hash and valid time
    const user = await User.findOne({
      resetPasswordToken: hashedTokenFromUrl,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      console.log("MATCH FAILED: No user found with this hash or token expired.");
      return res.status(400).json({ message: "Invalid or expired token. Request a new link." });
    }

    console.log("MATCH SUCCESS: User found:", user.email);

    // 3. Update Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    // 4. Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;