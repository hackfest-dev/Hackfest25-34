import mongoose from "mongoose"; // Import mongoose
import { dbConnect } from "@/lib/db"; // Your MongoDB connection
import missionSchema from "@/models/Mission"; // Your mission model
import { NextResponse } from "next/server"; // Import NextResponse

export async function GET(req) {
	try {
		const userId = req.nextUrl.searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "User ID is required" },
				{ status: 400 }
			);
		}

		// Convert userId to ObjectId if it's a valid 24-character hex string
		const objectId = mongoose.Types.ObjectId.isValid(userId)
			? new mongoose.Types.ObjectId(userId)
			: null;

		if (!objectId) {
			return NextResponse.json(
				{ success: false, message: "Invalid User ID" },
				{ status: 400 }
			);
		}

		// Connect to your database
		await dbConnect();

		// Fetch missions for the specific user
		const missions = await missionSchema.find({ userId: objectId });

		if (!missions || missions.length === 0) {
			return NextResponse.json(
				{ success: false, message: "No missions found for this user" },
				{ status: 404 }
			);
		}

		// Return the missions in the response
		return NextResponse.json({ success: true, missions }, { status: 200 });
	} catch (error) {
		console.error("Error fetching missions:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch missions.",
			},
			{ status: 500 }
		);
	}
}
