"use client";
import { useState } from "react";

let audioContext;
let mediaStream;
let analyser;
let dataArray;
let recording = false;

function startNoiseRecording(callback) {
	audioContext = new (window.AudioContext || window.webkitAudioContext)();
	navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
		mediaStream = stream;
		const source = audioContext.createMediaStreamSource(stream);
		analyser = audioContext.createAnalyser();
		source.connect(analyser);
		analyser.fftSize = 256;
		dataArray = new Uint8Array(analyser.frequencyBinCount);
		recording = true;

		function analyze() {
			analyser.getByteFrequencyData(dataArray);
			const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
			callback(Math.round(avg));
			if (recording) requestAnimationFrame(analyze);
		}

		analyze();
	});
}

function stopNoiseRecording() {
	recording = false;
	if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
	if (audioContext) audioContext.close();
}

export default function NoiseCapture() {
	const [volume, setVolume] = useState(0);
	const [description, setDescription] = useState("");
	const [isRecording, setIsRecording] = useState(false);

	const handleStart = () => {
		setIsRecording(true);
		startNoiseRecording((vol) => setVolume(vol));
	};

	const handleStop = () => {
		stopNoiseRecording();
		setIsRecording(false);

		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				const lat = pos.coords.latitude;
				const lng = pos.coords.longitude;

				const res = await fetch("/api/submit-noise", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						volume,
						lat,
						lng,
						description,
					}),
				});

				const result = await res.json();
				if (result.success) {
					alert("Noise report submitted!");
					setDescription("");
					setVolume(0);
				} else {
					alert("Failed to submit.");
				}
			},
			(err) => {
				alert("Location access denied.");
			}
		);
	};

	return (
		<div className="p-4 bg-white shadow-md rounded-xl max-w-md mx-auto space-y-4">
			<h2 className="text-xl font-bold">Noise Capture</h2>
			<p className="text-gray-700">
				Noise Level: <strong>{volume}</strong>
			</p>

			<textarea
				className="w-full border p-2 rounded-md"
				placeholder="Describe your environment (e.g. loud traffic, birds chirping)..."
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>

			{!isRecording ? (
				<button
					onClick={handleStart}
					className="bg-green-600 text-white px-4 py-2 rounded-md">
					Start Recording
				</button>
			) : (
				<button
					onClick={handleStop}
					className="bg-red-600 text-white px-4 py-2 rounded-md">
					Stop & Submit
				</button>
			)}
		</div>
	);
}
