const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
	const { username, password } = req.body;
	try {
		const hashed = await bcrypt.hash(password, 10);
		const user = await User.create({ username, password: hashed });
		res.status(201).json({ message: "User created" });
	} catch (err) {
		res.status(400).json({ error: "User already exists" });
	}
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });
	if (!user) return res.status(400).json({ error: "Invalid username" });

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) return res.status(400).json({ error: "Incorrect password" });

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
	res.json({ message: "Login successful", token });
});

module.exports = router;
