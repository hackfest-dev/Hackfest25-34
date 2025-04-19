import mongoose from "mongoose";

const User = new mongoose.Schema(
	{
		name: String,
		email: { type: String, unique: true },
		password: String,
		avatar: String,
		location: String,
		provider: String,
		role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
		ecoScore: { type: Number, default: 0 },
		badges: [String],
		streak: { type: Number, default: 0 },
		joinedAt: { type: Date, default: Date.now },
		contributionCount: { type: Number, default: 0 },
		contributionTypes: {
			photo: { type: Number, default: 0 },
			noise: { type: Number, default: 0 },
			observation: { type: Number, default: 0 },
		},
		exp: { type: Number, default: 0 },
		badges: [{ name: String, description: String, earnedAt: Date }],
		completedMissions: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Mission" },
		],
	},
	{ timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", User);
