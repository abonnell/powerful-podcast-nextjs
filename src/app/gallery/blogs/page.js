import Image from "next/image";
import Logo from "@public/logo.png";

export default function GalleryBlogs() {
  return (
    <div>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-16">
        <Image src={Logo} alt="Powerful Podcast Logo" width={300} height={300} className="mb-8" />
        <h1 className="text-5xl font-bold mb-4">Under Construction</h1>
        <p className="text-xl text-gray-400">This page is coming soon!</p>
      </div>
    </div>
  );
}
