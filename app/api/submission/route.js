// api/submission/route.js
import { dbConnect } from "@/lib/db";
import Submission from "@/models/Submission";
import { classifyImage } from "@/lib/ai/classifyImage"; // Import the function
import { NextResponse } from "next/server";

export async function POST(req) {
	await dbConnect();
	const body = await req.json();

	let aiData = {};
	if (body.type === "photo") {
		const { labels } = await classifyImage(body.mediaUrl); // Call the Vision API

		aiData = {
			species: labels[0]?.label || "unknown",
			confidence: labels[0]?.score || 0,
			labels: labels,
		};
	}

	try {
		const submission = await Submission.create({
			userId: body.userId,
			type: body.type || "photo",
			mediaUrl: body.mediaUrl,
			description: body.description,
			location: body.location,
			category: body.category,
			airData: body.airData,
			weather: body.weather,
			aiData: aiData, // Save AI data (labels)
			status: "pending",
			duplicate: false,
		});

		return NextResponse.json({ success: true, submission });
	} catch (err) {
		return NextResponse.json(
			{ success: false, error: err.message },
			{ status: 500 }
		);
	}
}
