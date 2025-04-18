import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	type: { type: String, enum: ["photo", "observation"] },
	mediaUrl: String,
	description: String,
	location: {
		lat: Number,
		lng: Number,
	},
	airData: {
		aqi: Number,
		pm25: Number,
		co: Number,
		fetchedAt: Date,
	},
	weather: {
		temp: Number,
		humidity: Number,
		description: String,
	},
	aiData: {
		species: String,
		confidence: Number,
		labels: [
			{
				label: String,
				score: Number,
			},
		],
		advancedAnalysis: String, // ← New field for advanced AI analysis
	},
	category: { type: String, enum: ["litter", "pollution", "wildlife"] },
	status: {
		type: String,
		enum: ["pending", "verified", "flagged"],
		default: "pending",
	},
	duplicate: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Submission ||
	mongoose.model("Submission", SubmissionSchema);
