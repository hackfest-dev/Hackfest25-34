export async function getLiveUserData() {
	const position = await new Promise((resolve, reject) =>
		navigator.geolocation.getCurrentPosition(resolve, reject)
	);

	const lat = position.coords.latitude;
	const lng = position.coords.longitude;

	// Reverse geocoding
	const geoRes = await fetch(
		"https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.OPENCAGE_API_KEY}"
	);
	const geoData = await geoRes.json();

	const locationData = geoData?.results?.[0]?.components || {};
	const city =
		locationData.city ||
		locationData.town ||
		locationData.village ||
		locationData.county ||
		"Unknown";
	const country = locationData.country || "Unknown";

	// Weather
	const weatherRes = await fetch(
		"https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric"
	);
	const weatherData = await weatherRes.json();

	// AQI
	const aqiRes = await fetch(
		"https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}"
	);
	const aqiData = await aqiRes.json();
	const aqi = aqiData?.list?.[0]?.main?.aqi || 1;

	return {
		location: { city, country, lat, lng },
		weather: {
			condition: weatherData.weather?.[0]?.main || "Unknown",
			temperature: Math.round(weatherData.main?.temp || 0),
		},
		aqi,
		userProfile: {
			pastMissions: [],
			preferredMissionType: "Nature Photography",
		},
	};
}
