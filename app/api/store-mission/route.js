// In app/api/store-mission/route.js

import mongoose from "mongoose";
import missionSchema from "@/models/Mission"; // Import your Mission model here

export async function POST(req) {
	try {
		const data = await req.json();

		// Convert userId to ObjectId only if it's not "guest"
		let userId =
			data.userId === "guest"
				? "guest"
				: new mongoose.Types.ObjectId(data.userId);

		console.log("Mission data:", data);

		const newMission = new missionSchema({
			title: data.title,
			description: data.description,
			steps: data.steps,
			reward: data.reward,
			funFact: data.funFact,
			tags: data.tags,
			userId: userId,
		});

		console.log("Mission data to be sent to backend:", newMission);
		await newMission.save();

		return new Response(
			JSON.stringify({
				success: true,
				message: "Mission saved successfully",
			}),
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error saving mission:", error);
		return new Response(
			JSON.stringify({
				success: false,
				message: error.message || "Error saving mission",
			}),
			{ status: 500 }
		);
	}
}
