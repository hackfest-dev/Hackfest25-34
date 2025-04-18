// /models/NoiseData.js
import mongoose from "mongoose";

const noiseDataSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		volumeLevel: { type: Number, required: true },
		description: { type: String }, // <-- NEW
		location: {
			type: { type: String, default: "Point" },
			coordinates: [Number],
		},
		weather: {
			temperature: Number,
			humidity: Number,
			condition: String,
		},
		airQuality: {
			aqi: Number,
			pm25: Number,
			pm10: Number,
			co: Number,
			no2: Number,
			o3: Number,
		},
		timestamp: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

noiseDataSchema.index({ location: "2dsphere" });

export default mongoose.models.NoiseData ||
	mongoose.model("NoiseData", noiseDataSchema);
