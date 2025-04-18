import dbConnect from "@/lib/db";
import Submission from "@/models/Submission";

export async function POST(req) {
	const { id, adminStatus, adminNotes } = await req.json();
	await dbConnect();

	await Submission.findByIdAndUpdate(id, {
		adminStatus,
		adminNotes,
	});

	return Response.json({ success: true });
}
