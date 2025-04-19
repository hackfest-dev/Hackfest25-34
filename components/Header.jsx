import Image from "next/image";

export default function Header() {
	return (
		<header className="w-full flex items-center justify-center p-4 bg-white shadow-sm">
			<div className="flex items-center gap-3 bg-gradient-to-r from-green-400 to-lime-500 px-4 py-2 rounded-xl">
				<Image
					src="/enviroquest-logo.png"
					alt="EnviroQuest Logo"
					width={32}
					height={32}
				/>
				<h1 className="text-xl font-bold text-white">EnviroQuest</h1>
			</div>
		</header>
	);
}
