const mongoose = require("mongoose");

const plannerSchema = new mongoose.Schema({
	userId: String,
	planner: Object, // Store planner JSON directly
});

module.exports = mongoose.model("Planner", plannerSchema);
