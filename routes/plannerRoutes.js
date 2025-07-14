const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Planner = require("../models/Planner");

// Health Check Route
router.get("/health", (req, res) => {
	res.status(200).json({ status: "OK", message: "Server is up and running" });
});

// Save data from frontend
router.post("/sync", async (req, res) => {
	const { user, planner } = req.body;

	try {
		// Upsert User
		await User.findOneAndUpdate({ id: user.id }, user, { upsert: true });

		// Upsert Planner
		await Planner.findOneAndUpdate({ userId: user.id }, { userId: user.id, planner }, { upsert: true });

		res.status(200).json({ message: "Data synced successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error syncing data", error });
	}
});

// Fetch planner data
router.get("/planner/:userId", async (req, res) => {
	try {
		const planner = await Planner.findOne({ userId: req.params.userId });
		if (!planner) return res.status(404).json({ message: "No planner found" });
		res.status(200).json(planner.planner);
	} catch (error) {
		res.status(500).json({ message: "Error fetching planner", error });
	}
});

module.exports = router;
