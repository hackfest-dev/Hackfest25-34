"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
	const { data: session } = useSession();

	return (
		<nav className="p-4 flex justify-between bg-gray-100">
			<div>
				<Link
					href="/"
					className="font-bold text-lg">
					EnviroQuest
				</Link>
			</div>
			<div className="space-x-4">
				{!session && (
					<>
						<Link href="/login">Login</Link>
						<Link href="/aignup">Register</Link>
					</>
				)}
				{session && (
					<>
						<Link href="/dashboard">Dashboard</Link>
						<LogoutButton />
					</>
				)}
			</div>
		</nav>
	);
}
