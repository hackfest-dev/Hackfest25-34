"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white shadow-md rounded-b-xl py-3 px-4 flex justify-center items-center">
      <div className="flex items-center space-x-3">
        <Image
          src="/enviroquest-logo.png"
          alt="EnviroQuest Logo"
          width={40}
          height={40}
        />
        <h1 className="text-xl font-bold text-green-700">EnviroQuest</h1>
      </div>
    </header>
  );
}
