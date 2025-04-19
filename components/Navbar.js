"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Leaf, Camera, User } from "lucide-react";

export default function Navbar() {
	const pathname = usePathname();

	const navItems = [
		{ name: "Home", href: "/", icon: <Home size={20} /> },
		{ name: "Missions", href: "/missions", icon: <Leaf size={20} /> },
		{ name: "Capture", href: "/capture", icon: <Camera size={20} /> },
		{ name: "Profile", href: "/profile", icon: <User size={20} /> },
	];

	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-green-100 to-green-200 border-t shadow-inner p-2 px-6 flex justify-between items-center z-50 rounded-t-2xl">
			{navItems.map(({ name, href, icon }) => {
				const isActive = pathname === href;

				return (
					<Link
						key={name}
						href={href}
						className={`flex flex-col items-center justify-center text-xs font-medium transition-all duration-200 ${
							isActive
								? "text-green-700 scale-110"
								: "text-gray-600 hover:text-green-600"
						}`}
					>
						{icon}
						<span className="mt-1">{name}</span>
					</Link>
				);
			})}
		</nav>
	);
}
