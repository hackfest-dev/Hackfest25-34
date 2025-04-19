import { dbConnect } from "@/lib/db";
import formidable from "formidable";
import { writeFile } from "fs/promises";
import path from "path";
import User from "@/models/User";
import Mission from "@/models/Mission";
import { generateBadgeWithGemini } from "@/lib/gemini";

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function POST(req) {
	await dbConnect();

	const form = formidable({ multiples: false });
	const [fields, files] = await new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) reject(err);
			else resolve([fields, files]);
		});
	});

	const { userId, missionId } = fields;
	const file = files.image;

	if (!userId || !missionId || !file) {
		return Response.json(
			{ success: false, message: "Missing data" },
			{ status: 400 }
		);
	}

	// Save image (or upload to Cloudinary instead)
	const data = await file.file.arrayBuffer();
	const fileName = Date.now() + "_" + file.originalFilename;
	const filePath = path.join(process.cwd(), "public/uploads", fileName);
	await writeFile(filePath, Buffer.from(data));

	// Award EXP and generate badge
	const expGained = 50;
	const badge = await generateBadgeWithGemini(missionId);

	await User.findByIdAndUpdate(userId, {
		$inc: { exp: expGained },
		$push: {
			badges: {
				name: badge.name,
				description: badge.description,
				earnedAt: new Date(),
			},
			completedMissions: missionId,
		},
	});

	return Response.json({
		success: true,
		message: `Mission completed! +${expGained} EXP.`,
	});
}
