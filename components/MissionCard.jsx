"use client";

export default function MissionCard({ title, description, completed }) {
	return (
		<div className="border rounded-2xl p-4 shadow-md bg-white">
			<h3 className="font-bold text-lg mb-1">{title}</h3>
			<p className="text-sm mb-2 text-gray-600">{description}</p>
			<p className={`font-semibold ${completed ? "text-green-600" : "text-red-500"}`}>
				{completed ? "Completed" : "Pending"}
			</p>
		</div>
	);
}
