import { dbConnect } from "@/lib/db";
import SubmissionSchema from "@/models/Submission"; // or whatever model you use
import { NextResponse } from "next/server";

export async function GET() {
	await dbConnect();

	const submissions = await SubmissionSchema.find({}).sort({ createdAt: -1 });

	return NextResponse.json(submissions);
}
