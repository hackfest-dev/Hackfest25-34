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
