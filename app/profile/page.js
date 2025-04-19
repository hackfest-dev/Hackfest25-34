"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import BadgeBar from "@/components/BadgeBar";
import { UserCircle } from "lucide-react";

export default function ProfilePage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status, router]);

	if (status === "loading") {
		return <div className="text-center mt-20 text-xl">Loading...</div>;
	}

	const user = session?.user || {};
	const badges = ["Eco Warrior", "Green Thumb", "Nature Ninja"];

	return (
		<div className="min-h-screen px-4 py-10 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
			<div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6">
				<div className="flex items-center space-x-4">
					<div className="w-20 h-20 rounded-full border-4 border-green-400 bg-green-100 flex items-center justify-center">
						<UserCircle className="w-16 h-16 text-green-600" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-800">{user.name || "Explorer"}</h1>
						<p className="text-gray-600">@{user.email?.split("@")[0]}</p>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
					<div className="bg-green-100 p-4 rounded-lg shadow">
						<p className="text-lg font-semibold">XP</p>
						<p className="text-xl font-bold text-green-700">340</p>
					</div>
					<div className="bg-blue-100 p-4 rounded-lg shadow">
						<p className="text-lg font-semibold">Missions</p>
						<p className="text-xl font-bold text-blue-700">12</p>
					</div>
					<div className="bg-purple-100 p-4 rounded-lg shadow">
						<p className="text-lg font-semibold">Streak</p>
						<p className="text-xl font-bold text-purple-700">4 days</p>
					</div>
				</div>

				<div>
					<h2 className="text-xl font-semibold text-gray-800 mb-2">Your Badges</h2>
					<BadgeBar badges={badges} />
				</div>

				<div className="text-right">
					<button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition">
						Edit Profile
					</button>
				</div>
			</div>
		</div>
	);
}
