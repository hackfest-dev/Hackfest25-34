"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
	const { data: session } = useSession();

	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-green-100 to-green-200 border-t shadow-inner p-3 flex justify-around items-center z-50">
			<Link href="/" className="text-sm text-gray-700 hover:text-green-700 font-medium">Home</Link>
			<Link href="/missions" className="text-sm text-gray-700 hover:text-green-700 font-medium">Missions</Link>
			<Link href="/capture" className="text-sm text-gray-700 hover:text-green-700 font-medium">Capture</Link>
			<Link href="/profile" className="text-sm text-gray-700 hover:text-green-700 font-medium">Profile</Link>
			<Link href="/admin/dashboard" className="text-sm text-red-600 hover:text-red-700 font-semibold">Admin Dashboard</Link>
			{session && (
				<button
					onClick={() => signOut({ callbackUrl: "/login" })}
					className="text-sm text-gray-700 hover:text-black font-medium px-2 py-1 bg-white rounded-lg shadow hover:bg-gray-100 transition"
				>
					Logout
				</button>
			)}
		</nav>
	);
}
