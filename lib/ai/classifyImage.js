import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

export async function classifyImage(mediaUrl, threshold = 0.6) {
	try {
		const [result] = await client.labelDetection(mediaUrl);
		const labels = result.labelAnnotations || [];

		const filteredLabels = labels
			.filter((label) => label.score >= threshold)
			.map((label) => ({
				label: label.description,
				score: label.score,
			}));
		console.log("Filtered Labels:", filteredLabels);

		return {
			labels: filteredLabels,
		};
	} catch (err) {
		console.error("Vision API error:", err);
		return { labels: [] };
	}
}
