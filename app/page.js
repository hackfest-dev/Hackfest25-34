"use client";

import { useState } from "react";
import UploadForm from "@/components/Submission";

export default function Home() {
	const [imageUrl, setImageUrl] = useState("");
	const [labels, setLabels] = useState([]);

	const analyzeImage = async () => {
		const res = await fetch("/api/analyze", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ imageUrl }),
		});

		const data = await res.json();
		setLabels(data.labels || []);
	};

	return (
		<main className="p-6">
			Home
			<UploadForm />
		</main>
	);
}
