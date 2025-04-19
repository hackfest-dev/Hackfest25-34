import { FaLeaf } from "react-icons/fa";

export default function AQICard({ city, aqi }) {
	const getAQIStatus = (aqi) => {
		if (aqi <= 50) return { status: "Good", color: "bg-green-400" };
		if (aqi <= 100) return { status: "Moderate", color: "bg-yellow-400" };
		if (aqi <= 150) return { status: "Unhealthy for Sensitive Groups", color: "bg-orange-400" };
		if (aqi <= 200) return { status: "Unhealthy", color: "bg-red-400" };
		return { status: "Very Unhealthy", color: "bg-purple-500" };
	};

	const { status, color } = getAQIStatus(aqi);

	return (
		<div className={`p-5 rounded-xl shadow-xl text-white ${color} transition-all`}>
			<div className="flex items-center gap-4">
				<FaLeaf className="text-4xl" />
				<div>
					<h3 className="text-xl font-bold">{city}</h3>
					<p className="text-sm">{status}</p>
				</div>
			</div>
			<div className="mt-4 text-5xl font-extrabold">{aqi}</div>
		</div>
	);
}
