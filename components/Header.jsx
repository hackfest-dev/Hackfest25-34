"use client";
import Image from "next/image";

export default function Header() {
	return (
		<header className="w-full bg-white/70 backdrop-blur-md shadow-md px-4 py-3 flex items-center justify-between border-b border-green-300">
			<div className="flex items-center space-x-3">
				<Image
					src="/enviroquest-logo.png"
					alt="EnviroQuest Logo"
					width={40}
					height={40}
					className="rounded-full"
				/>
				<h1 className="text-2xl font-bold text-green-800 tracking-wide">
					EnviroQuest
				</h1>
			</div>

			<div className="text-sm text-green-700 font-medium hidden sm:block">
				🌿 Gamify Your Green Journey
			</div>
		</header>
	);
}
