import { dbConnect } from "@/lib/db";
import missionSchema from "@/models/Mission";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		await dbConnect();

		const missions = await missionSchema.find().sort({ createdAt: -1 }); // Gets all missions

		return NextResponse.json({ success: true, missions }, { status: 200 });
	} catch (error) {
		console.error("Error fetching all missions:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch all missions." },
			{ status: 500 }
		);
	}
}
