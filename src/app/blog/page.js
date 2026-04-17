import BlogGrid from "@components/BlogGrid/BlogGrid.jsx";
import LogoImage from "@public/logo.png";
import strapi from "@/lib/strapi";
import { generateBlogSlug, getPreviewText } from "@/lib/blog";

export const revalidate = 14400; // Revalidate every 4 hours

export default async function BlogsPage() {
  let blogs = [];
  let authors = [];
  
  // Fetch blogs from Strapi
  try {
    const response = await strapi.find("blogs");
    const strapiBlogs = response.data || [];
    
    // Extract unique authors from the blogs
    authors = strapi.extractUniqueAuthors(strapiBlogs);
    
    // Transform Strapi blogs to component format
    blogs = strapiBlogs.map((blog) => {
      // Use Cover image from Strapi if available, otherwise fallback to static logo
      let imgSrc = LogoImage;
      if (blog.Cover?.url) {
        imgSrc = `${process.env.STRAPI_BASE_PATH}${blog.Cover.url}`;
      }
      
      return {
        img: imgSrc,
        imgAlt: blog.Title,
        title: blog.Title,
        href: `/blog/${generateBlogSlug(blog.Title)}`,
        previewText: getPreviewText(blog.Body, 100),
        author: blog.createdBy ? `${blog.createdBy.firstname} ${blog.createdBy.lastname}` : null,
        createdAt: blog.createdAt,
      };
    });
  } catch (error) {
    console.error("Error fetching blogs from Strapi:", error);
  }

  return (
    <div>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">All Blogs</h1>
        
        <BlogGrid blogs={blogs} authors={authors} />
      </div>
    </div>
  );
}

