"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function AdminMap({ submissions }) {
	const defaultPosition = [20, 0];

	return (
		<MapContainer
			center={defaultPosition}
			zoom={2}
			className="h-[500px] w-full rounded-xl z-0">
			<TileLayer
				attribution="&copy; OpenStreetMap"
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{submissions.map((s) => {
				const { lat, lon } = s.location || {};
				if (!lat || !lon) return null;

				return (
					<Marker
						key={s._id}
						position={[lat, lon]}>
						<Popup>
							<strong>{s.aiResult?.label || "Unknown"}</strong>
							<br />
							<img
								src={s.imageUrl}
								width={150}
								alt="preview"
								className="mt-2 rounded"
							/>
							<p className="text-xs">
								City: {s.location.city || "Unknown"}
							</p>
						</Popup>
					</Marker>
				);
			})}
		</MapContainer>
	);
}
