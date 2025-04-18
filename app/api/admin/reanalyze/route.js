import { analyzeWithGemini } from "@/lib/gemini"; // Your Gemini logic
import { dbConnect } from "@/lib/db";
import Submission from "@/models/Submission";

export async function POST(req) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");

	await dbConnect();
	const submission = await Submission.findById(id);
	const analysis = await analyzeWithGemini(submission.mediaUrl);

	submission.aiResult = analysis;
	await submission.save();

	return Response.json({ aiResult: analysis });
}
