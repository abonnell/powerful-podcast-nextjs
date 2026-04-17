import Image from "next/image";
import strapi from "@/lib/strapi";
import LogoImage from "@public/logo.png";
import { notFound } from "next/navigation";
import { generateBlogSlug } from "@/lib/blog";

export const revalidate = 14400; // Revalidate every 4 hours

export default async function BlogPost({ params }) {
  const { slug } = await params;
  
  let blog = null;
  
  try {
    const response = await strapi.find("blogs");
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
    ? `${process.env.STRAPI_BASE_PATH}${blog.Cover.url}`
    : LogoImage;

  return (
    <div>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{blog.Title}</h1>
        <div className="text-gray-600 dark:text-gray-400 mb-8">
          {blog.createdBy && (
            <span className="font-medium">By {blog.createdBy.firstname} {blog.createdBy.lastname} • </span>
          )}
          {new Date(blog.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div className="mb-8 flex justify-center">
          <Image
            src={blogImage}
            alt={blog.Title}
            width={400}
            height={400}
            className="object-cover rounded-lg"
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
