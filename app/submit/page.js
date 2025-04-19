"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SubmitPage() {
	const { data: session } = useSession();
	const searchParams = useSearchParams();
	const missionId = searchParams.get("missionId");
	const [image, setImage] = useState(null);
	const [status, setStatus] = useState(null);

	const handleSubmit = async () => {
		const formData = new FormData();
		formData.append("image", image);
		formData.append("userId", session?.user?.id);
		formData.append("missionId", missionId);

		const res = await fetch("/api/complete-mission", {
			method: "POST",
			body: formData,
		});

		const data = await res.json();
		setStatus(data.message);
	};

	return (
		<div className="max-w-xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Submit for Mission</h1>
			<input
				type="file"
				accept="image/*"
				onChange={(e) => setImage(e.target.files[0])}
				className="mb-4"
			/>
			<button
				onClick={handleSubmit}
				className="bg-green-600 text-white px-4 py-2 rounded">
				Submit
			</button>
			{status && <p className="mt-4">{status}</p>}
		</div>
	);
}
