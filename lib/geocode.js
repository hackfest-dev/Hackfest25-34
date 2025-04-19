// lib/geocode.js
import axios from "axios";

export async function getLocationDetails(lat, lon) {
	const apiKey = process.env.OPENCAGE_API_KEY;
	const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

	try {
		const response = await axios.get(url);
		const data = response.data.results[0].components;

		return {
			country: data.country || "",
			state: data.state || "",
			city: data.city || data.town || data.municipality || "",
			village: data.village || data.hamlet || "",
		};
	} catch (error) {
		console.error("Geocoding error:", error);
		return {
			country: "",
			state: "",
			city: "",
			village: "",
		};
	}
}
