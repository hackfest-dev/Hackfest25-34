// src/components/Navbar.js
"use client";

import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner p-3 flex justify-around items-center z-50">
			<Link href="/" className="text-sm text-gray-700 hover:text-green-600">Home</Link>
			<Link href="/missions" className="text-sm text-gray-700 hover:text-green-600">Missions</Link>
			<Link href="/capture" className="text-sm text-gray-700 hover:text-green-600">Capture</Link>
			<Link href="/profile" className="text-sm text-gray-700 hover:text-green-600">Profile</Link>
		</nav>
	);
}
