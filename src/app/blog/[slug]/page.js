import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButton from "@/components/ShareButton/ShareButton.jsx";
import { renderTipTapContent } from "@/lib/tiptap-renderer";
import { getAllBlogs, getBlogBySlug } from "@/lib/data";

export const revalidate = 14400; // Revalidate every 4 hours

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  const { blogs } = await getAllBlogs();
  
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  
  // Fetch the specific blog using centralized data layer
  const blog = await getBlogBySlug(slug);
  
  if (!blog) {
    notFound();
  }

  // Render TipTap JSON content to HTML
  const renderedContent = renderTipTapContent(blog.rawBody);

  return (
    <div>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="text-gray-600 dark:text-gray-400 mb-8 flex flex-wrap items-center gap-3">
          <div>
            {blog.author && (
              <span className="font-medium">
                By <Link 
                  href={`/blog?author=${blog.author.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-primary-main transition-colors underline"
                >
                  {blog.author}
                </Link> •{" "}
              </span>
            )}
            {new Date(blog.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <ShareButton />
        </div>
        <div className="mb-8 w-full">
          <Image
            src={blog.img}
            alt={blog.title}
            width={1200}
            height={600}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div 
          className="blog-content text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </div>
    </div>
  );
}
