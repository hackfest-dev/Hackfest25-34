//app/api/environmental/route.js
import { NextResponse } from "next/server";

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const lat = searchParams.get("lat");
	const lng = searchParams.get("lng");

	if (!lat || !lng) {
		return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
	}

	try {
		const [airRes, weatherRes] = await Promise.all([
			fetch(
				`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${API_KEY}`
			),
			fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`
			),
		]);

		const airJson = await airRes.json();
		const weatherJson = await weatherRes.json();

		const air = airJson.list?.[0] || {};

		return NextResponse.json({
			air: {
				aqi: air.main?.aqi || null,
				pm25: air.components?.pm2_5 || null,
				co: air.components?.co || null,
				fetchedAt: new Date(),
			},
			weather: {
				temp: weatherJson.main?.temp,
				humidity: weatherJson.main?.humidity,
				description: weatherJson.weather?.[0]?.description,
			},
		});
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
