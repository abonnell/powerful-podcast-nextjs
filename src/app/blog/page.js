import { Suspense } from "react";
import BlogGrid from "@components/BlogGrid/BlogGrid.jsx";
import { getAllBlogs } from "@/lib/data";

export const revalidate = 14400; // Revalidate every 4 hours

export default async function BlogsPage() {
  // Fetch all blogs from centralized data layer
  const { blogs, authors } = await getAllBlogs();

  return (
    <div>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">All Blogs</h1>
        
        <Suspense fallback={<div className="text-center py-8">Loading blogs...</div>}>
          <BlogGrid blogs={blogs} authors={authors} />
        </Suspense>
      </div>
    </div>
  );
}

