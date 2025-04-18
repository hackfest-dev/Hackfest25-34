import { dbConnect } from "@/lib/db";
import Submission from "@/models/Submission";
import { NextResponse } from "next/server";

export async function POST(req) {
	await dbConnect();
	const body = await req.json();

	try {
		const submission = await Submission.create({
			userId: body.userId,
			type: body.type || "photo",
			mediaUrl: body.mediaUrl,
			description: body.description,
			location: body.location,
			category: body.category,
			status: "pending",
			duplicate: false,
			aiData: body.aiData || {},
		});

		return NextResponse.json({ success: true, submission });
	} catch (err) {
		return NextResponse.json(
			{ success: false, error: err.message },
			{ status: 500 }
		);
	}
}
