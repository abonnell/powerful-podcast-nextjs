import Image from "next/image";
import Link from "next/link";
import strapi from "@/lib/strapi";
import LogoImage from "@public/logo.png";
import { notFound } from "next/navigation";
import { generateBlogSlug } from "@/lib/blog";
import ShareButton from "@/components/ShareButton/ShareButton.jsx";

export const revalidate = 14400; // Revalidate every 4 hours

export default async function BlogPost({ params }) {
  const { slug } = await params;
  
  let blog = null;
  
  try {
    const response = await strapi.find("blogs?populate=Cover&populate=createdBy");
    const blogs = response.data || [];
    
    // Find the blog that matches the slug
    blog = blogs.find((b) => generateBlogSlug(b.Title) === slug);
    
    if (!blog) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching blog from Strapi:", error);
    notFound();
  }
  
  // Use Cover image from Strapi if available, otherwise fallback to logo.png
  const blogImage = blog.Cover?.url 
    ? (blog.Cover.url.startsWith('http') ? blog.Cover.url : `${process.env.STRAPI_BASE_PATH}${blog.Cover.url}`)
    : LogoImage;

  return (
    <div>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{blog.Title}</h1>
        <div className="text-gray-600 dark:text-gray-400 mb-8 flex flex-wrap items-center gap-3">
          <div>
            {blog.createdBy && (
              <span className="font-medium">
                By <Link 
                  href={`/blog?author=${`${blog.createdBy.firstname}-${blog.createdBy.lastname}`.toLowerCase()}`}
                  className="hover:text-primary-main transition-colors underline"
                >
                  {blog.createdBy.firstname} {blog.createdBy.lastname}
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
            src={blogImage}
            alt={blog.Title}
            width={1200}
            height={600}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div 
          className="blog-content text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.Body }}
        />
      </div>
    </div>
  );
}
