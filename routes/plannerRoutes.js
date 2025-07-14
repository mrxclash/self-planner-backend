const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Planner = require("../models/Planner");

// Health Check Route
router.get("/health", (req, res) => {
	res.status(200).json({ status: "OK", message: "Server is up and running" });
});

// Login Route
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email, password });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: "Login failed", error: err.message });
	}
});

// Save data from frontend
// Save data from frontend (merge planner)
router.post("/sync", async (req, res) => {
	const { user, planner: incomingPlanner } = req.body;

	try {
		// Upsert User
		await User.findOneAndUpdate({ id: user.id }, user, { upsert: true });

		// Fetch existing planner
		let existing = await Planner.findOne({ userId: user.id });

		// Merge planners
		const mergedPlanner = { ...(existing?.planner || {}) };

		for (const date in incomingPlanner) {
			if (!mergedPlanner[date]) {
				// No data for this date — use incoming
				mergedPlanner[date] = incomingPlanner[date];
			} else {
				// Merge tasks for this date
				const existingTasks = mergedPlanner[date].tasks || {};
				const newTasks = incomingPlanner[date].tasks || {};

				mergedPlanner[date].tasks = {
					...existingTasks,
					...newTasks,
				};
			}
		}

		// Save merged planner
		await Planner.findOneAndUpdate(
			{ userId: user.id },
			{ userId: user.id, planner: mergedPlanner },
			{ upsert: true }
		);

		res.status(200).json({ message: "Planner synced with merge." });
	} catch (error) {
		console.error("Sync Error:", error);
		res.status(500).json({ message: "Error syncing planner", error });
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
