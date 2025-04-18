// /app/api/submit-noise/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import NoiseData from "@/models/NoiseData";

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

async function getWeather(lat, lon) {
	const res = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
	);

	if (!res.ok) {
		console.error("Weather API failed:", await res.text());
		return {
			temperature: null,
			humidity: null,
			condition: "Unavailable",
		};
	}

	const data = await res.json();
	if (!data.main || !data.weather) {
		console.error("Weather data missing:", data);
		return {
			temperature: null,
			humidity: null,
			condition: "Unavailable",
		};
	}

	return {
		temperature: data.main.temp,
		humidity: data.main.humidity,
		condition: data.weather[0].main,
	};
}

async function getAirQuality(lat, lon) {
	const res = await fetch(
		`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
	);

	if (!res.ok) {
		console.error("Air Quality API failed:", await res.text());
		return {
			aqi: null,
			pm25: null,
			pm10: null,
			co: null,
			no2: null,
			o3: null,
		};
	}

	const data = await res.json();
	const air = data?.list?.[0];
	if (!air || !air.main || !air.components) {
		console.error("Air data missing:", data);
		return {
			aqi: null,
			pm25: null,
			pm10: null,
			co: null,
			no2: null,
			o3: null,
		};
	}

	return {
		aqi: air.main.aqi,
		pm25: air.components.pm2_5,
		pm10: air.components.pm10,
		co: air.components.co,
		no2: air.components.no2,
		o3: air.components.o3,
	};
}

export async function POST(req) {
	try {
		await dbConnect();
		const { volume, lat, lng, description } = await req.json();

		if (!volume || !lat || !lng) {
			return NextResponse.json(
				{ success: false, error: "Missing data" },
				{ status: 400 }
			);
		}

		const weather = await getWeather(lat, lng);
		const airQuality = await getAirQuality(lat, lng);

		const entry = await NoiseData.create({
			volumeLevel: volume,
			description,
			location: {
				type: "Point",
				coordinates: [lng, lat],
			},
			weather,
			airQuality,
			timestamp: new Date(),
		});

		return NextResponse.json(
			{ success: true, data: entry },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Noise submit error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
