"use client";

export default function AQICard({ city = "Bengaluru", aqi = 85 }) {
	const aqiColor =
		aqi <= 50
			? "bg-green-500"
			: aqi <= 100
			? "bg-yellow-400"
			: aqi <= 150
			? "bg-orange-400"
			: aqi <= 200
			? "bg-red-500"
			: "bg-purple-700";

	return (
		<div className={`rounded-2xl shadow-md p-4 text-white ${aqiColor}`}>
			<h2 className="text-xl font-bold">Air Quality - {city}</h2>
			<p className="text-4xl mt-2">AQI: {aqi}</p>
		</div>
	);
}
