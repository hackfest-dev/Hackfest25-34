// models/Mission.js
import mongoose from "mongoose";

const missionSchema = new mongoose.Schema(
	{
		title: String,
		description: String,
		steps: [String],
		reward: String,
		funFact: String,
		tags: [String],
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional: to associate the mission with a user
		status: {
			type: String,
			enum: ["incomplete", "completed", "in-progress"],
			default: "incomplete",
		}, // Status field
	},
	{ timestamps: true } // Automatically add createdAt and updatedAt fields
);

// const Mission =
// 	mongoose.models.Mission || mongoose.model("Mission", missionSchema);

// module.exports = Mission;
export default mongoose.models.Mission ||
	mongoose.model("Mission", missionSchema);
