// models/Mission.js
const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema({
	userId: mongoose.Schema.Types.ObjectId,
	title: String,
	description: String,
	steps: [String],
	reward: String,
	tags: [String],
	location: {
		city: String,
		country: String,
	},
	generatedAt: { type: Date, default: Date.now },
});

module.exports =
	mongoose.models.Mission || mongoose.model("Mission", MissionSchema);
