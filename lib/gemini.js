import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export async function analyzeWithGemini(prompt) {
	try {
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,

			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contents: [
						{
							parts: [{ text: prompt }],
						},
					],
				}),
			}
		);

		const data = await response.json();
		// console.log("Gemini raw response:", JSON.stringify(data, null, 2));

		return (
			data?.candidates?.[0]?.content?.parts?.[0]?.text ||
			"No response from Gemini"
		);
	} catch (err) {
		console.error("Gemini error:", err);
		return "Error generating analysis";
	}
}

export async function generateBadgeWithGemini(missionId) {
	const prompt = `
You are a creative AI in a gamified environmental app. 
Create a fun, unique badge title and description for a completed mission with ID: ${missionId}.
Make it short, exciting, and motivating.
Respond with JSON like: { "name": "...", "description": "..." }
`;

	const model = genAI.getGenerativeModel({ model: "gemini-pro" });
	const result = await model.generateContent(prompt);
	const text = result.response.text();

	try {
		const json = JSON.parse(text);
		return json;
	} catch (err) {
		return {
			name: "🌟 Eco Explorer",
			description: "For completing an eco-friendly mission.",
		};
	}
}
