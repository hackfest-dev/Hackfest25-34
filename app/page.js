"use client";

import { useState } from "react";
import UploadForm from "@/components/Submission";
import NoiseCapture from "@/components/Noise";
import AQICard from "@/components/AQICard";
import BadgeBar from "@/components/BadgeBar";
import MissionCard from "@/components/MissionCard";
import XPProgress from "@/components/XPProgress";
import Header from "@/components/Header"; // Import the Header component
import Link from "next/link";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [labels, setLabels] = useState([]);
  const [missions] = useState([
    { title: "Plant a Tree", description: "Plant one sapling in your neighborhood", completed: true },
    { title: "Carpool to Work", description: "Share a ride with at least 2 people", completed: false },
    { title: "Recycle Plastic", description: "Recycle 1kg of plastic waste", completed: false },
  ]);
  const [badges] = useState(["Eco Warrior", "Green Thumb", "Nature Ninja"]);

  const analyzeImage = async () => {
    if (!imageUrl) return;

    // Make the API call to analyze the uploaded image
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await res.json();
    setLabels(data.labels || []); // Assuming the API returns a 'labels' array
  };

  return (
    <main className="p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Use Header Component */}
      <Header />

      {/* AQICard */}
      <AQICard city="Bengaluru" aqi={85} className="mb-8" />

      {/* Image Upload Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Image for Analysis</h2>
        <div className="flex items-center justify-between border-2 border-dashed border-gray-300 p-4 rounded-lg">
          <UploadForm setImageUrl={setImageUrl} />
          {imageUrl ? (
            <span className="text-green-600 font-medium">File Selected</span>
          ) : (
            <span className="text-gray-500">No File Chosen</span>
          )}
        </div>
        <button
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
          onClick={analyzeImage}
        >
          Analyze Image
        </button>
      </div>

      {/* Image Analysis Results */}
      {labels.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Image Analysis Results</h3>
          <ul className="list-disc pl-6">
            {labels.map((label, index) => (
              <li key={index} className="text-gray-700">{label}</li>
            ))}
          </ul>
        </div>
      )}

      {/* AQI, XP, Badge, Mission Display */}
      <div className="space-y-8">
        {/* XPProgress */}
        <XPProgress level={3} xp={120} goal={250} />

        {/* BadgeBar */}
        <BadgeBar badges={badges} />

        {/* Missions */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Missions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {missions.map((m, i) => (
              <MissionCard key={i} {...m} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navbar */}
      <nav className="bg-blue-600 text-white py-4 fixed bottom-0 left-0 right-0 flex justify-around shadow-lg">
        <Link href="/" className="flex flex-col items-center">
          <span>Home</span>
        </Link>
        <Link href="/missions" className="flex flex-col items-center">
          <span>Missions</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center">
          <span>Profile</span>
        </Link>
        <Link href="/capture" className="flex flex-col items-center">
          <span>Capture</span>
        </Link>
      </nav>
    </main>
  );
}
