"use client";

export default function BadgeBar({ badges = [] }) {
	return (
		<div className="flex flex-wrap gap-2 p-4 bg-gray-100 rounded-2xl shadow-md">
			{badges.length === 0 ? (
				<p>No badges yet</p>
			) : (
				badges.map((badge, idx) => (
					<div
						key={idx}
						className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
						{badge}
					</div>
				))
			)}
		</div>
	);
}
