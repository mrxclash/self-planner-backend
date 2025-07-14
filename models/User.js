const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	createdAt: String,
	id: String,
});

module.exports = mongoose.model("User", userSchema);
