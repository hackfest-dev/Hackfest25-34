import { getLocationDetails } from "@/lib/geocode";
import { connectDB } from "@/lib/db"; // your MongoDB connect util
import Observation from "@/models/Observation"; // or Submission/ImageSubmission
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		await connectDB();

		const body = await req.json();
		const { coordinates, ...rest } = body;

		if (!coordinates || coordinates.length !== 2) {
			return NextResponse.json(
				{ error: "Coordinates required" },
				{ status: 400 }
			);
		}

		const [lon, lat] = coordinates;
		const locationDetails = await getLocationDetails(lat, lon);

		const newObservation = new Observation({
			...rest,
			location: {
				type: "Point",
				coordinates: [lon, lat],
				...locationDetails,
			},
		});

		await newObservation.save();

		return NextResponse.json(
			{ success: true, data: newObservation },
			{ status: 201 }
		);
	} catch (err) {
		console.error("Submission error:", err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
