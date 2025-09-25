"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to TalkEasy</h1>
      <p className="text-gray-600">This is your dashboard.</p>

      <div className="mt-6">
        <Image src="/next.svg" alt="Next.js logo" width={120} height={30} />
      </div>
    </div>
  );
}
