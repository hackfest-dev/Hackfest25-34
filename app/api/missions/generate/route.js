export async function POST(req) {
	try {
		const userData = await req.json();
		const API_KEY = process.env.GEMINI_API_KEY;

		if (!API_KEY) {
			console.error("GEMINI_API_KEY not set");
			return new Response("API key not set", { status: 500 });
		}

		const geminiResponse = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [
								{
									text: `
  You are an eco-friendly mission generator for an environmental app called EnviroQuest. 
  Generate a short mission based on this user data:
  
  - Location: ${userData.location?.city}, ${userData.location?.country}
  - Weather: ${userData.weather?.description} (${userData.weather?.temp}°C)
  - Air Quality: AQI ${userData.aqi}
  
  Randomly choose a mission template from the following options, with location, weather, and AQI included in each mission:
  
  ### Mission Template 1: Wildlife Snapshot
  - **Take** a picture of wildlife (like an animal, bird, or insect) you spot in the nearby park, forest, or your backyard.
  - **Observe** the animal and make a note of its behavior or environment.
  - **Upload** the image and any notes about the wildlife to the app.
  
  ### Mission Template 2: Litter Reporting
  - **Walk** around your neighborhood, park, or nearby area to look for any litter or trash.
  - **Report** the litter by taking a photo and uploading it to the app.
  - **Optionally**, note the type of waste (plastic, paper, etc.) and suggest a recycling solution.
  
  ### Mission Template 3: Clean Air Check
  - **Take** a picture of your surroundings and document how clean the air looks today.
  - **Check** the air quality using the AQI and see how it compares to the suggested levels for healthy living.
  - **Report** your findings and share them with the app.
  
  ### Mission Template 4: Plant Identification
  - **Take** a picture of a plant you find in a park or green space nearby.
  - **Use** the app to identify the plant and learn more about it.
  - **Upload** the image and the name of the plant to share with others.
  
  ### Mission Template 5: Recycle Awareness
  - **Look** for any recycling bins around your area.
  - **Take** a picture of them to show how they are being used (or misused).
  - **Upload** the image to raise awareness of recycling efforts in your community.
  
  Your output must be in structured Markdown format like this:
  
  ### Mission Title
  [One-liner mission intro or objective]
  
  ### Description
  [A friendly paragraph explaining the goal and why it matters]
  
  ### Steps
  - Step 1
  - Step 2
  - Step 3
  (Use **bold** for key action words like "Collect", "Sort", "Observe")
  
  ### Reward Summary
  [Short fun reward description — feel free to add a creative badge name like “EcoHero”]
  
  ### Fun Fact
  [A surprising or inspiring environmental fact]
  
  ### Tags
  #sustainability #recycling #cleanAir (1–3 tags based on the mission)
  
  Return only markdown. No explanations.`,
								},
							],
						},
					],
				}),
			}
		);

		const geminiJson = await geminiResponse.json();

		if (!geminiResponse.ok) {
			console.error("Gemini Error:", geminiJson);
			throw new Error("Failed to get mission from Gemini");
		}

		const rawText =
			geminiJson.candidates?.[0]?.content?.parts?.[0]?.text || "";

		// Optional: parse markdown into structured mission data
		function parseMission(raw) {
			const sections = raw.split(/\n###\s+/).map((s) => s.trim());
			const getSection = (label) =>
				sections.find((s) => s.startsWith(label)) || "";

			const titleBlock = sections[0] || "";
			const titleLine = titleBlock.split("\n")[0];
			const description = getSection("Description")
				.replace("Description", "")
				.trim();

			const steps = (getSection("Steps") || "")
				.replace("Steps", "")
				.split("\n")
				.map((s) => s.trim())
				.filter((s) => s.startsWith("-"))
				.map((s) => s.slice(1).trim());

			const reward = getSection("Reward Summary")
				.replace("Reward Summary", "")
				.trim();
			const funFact = getSection("Fun Fact")
				.replace("Fun Fact", "")
				.trim();

			const tagsLine = getSection("Tags").replace("Tags", "").trim();
			const tags = tagsLine
				.split(/\s+/)
				.filter((t) => t.startsWith("#"))
				.map((t) => t.slice(1));

			return {
				success: true,
				title: titleLine || "Untitled Mission",
				description,
				steps,
				reward,
				funFact,
				tags,
			};
		}

		const missionData = parseMission(rawText);

		return new Response(JSON.stringify(missionData), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error("API Error:", err);
		return new Response("Error generating mission", { status: 500 });
	}
}
