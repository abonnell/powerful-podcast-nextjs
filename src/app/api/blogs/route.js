import { NextResponse } from 'next/server';
import strapi from '@/lib/strapi';
import { generateBlogSlug, getPreviewText } from '@/lib/blog';

export async function GET() {
  try {
    const response = await strapi.find("blogs?populate=Cover&populate=createdBy");
    const strapiBlogs = response.data || [];
    
    // Transform Strapi blogs to component format
    const blogs = strapiBlogs.map((blog) => {
      // Use Cover image from Strapi if available, otherwise fallback to logo.png
      let imgSrc = '/logo.png';
      if (blog.Cover?.url) {
        imgSrc = blog.Cover.url.startsWith('http') ? blog.Cover.url : `${process.env.STRAPI_BASE_PATH}${blog.Cover.url}`;
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
    
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs from Strapi:", error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
