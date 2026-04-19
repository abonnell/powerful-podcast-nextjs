import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { generateBlogSlug } from '@/lib/blog';

/**
 * On-demand revalidation endpoint for blog posts
 * This endpoint should be called by Strapi webhooks when a blog is published/updated
 * 
 * Expected payload:
 * {
 *   "secret": "your-secret-token",
 *   "type": "blog",
 *   "slug": "blog-post-slug" // optional, if not provided revalidates all blog pages
 *   "title": "Blog Title" // optional, used to generate slug if slug not provided
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Verify secret token to prevent unauthorized revalidation
    const secret = body.secret;
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret token' },
        { status: 401 }
      );
    }
    
    // Determine what to revalidate
    const type = body.type || 'blog';
    
    if (type === 'blog') {
      // Always revalidate the main blog listing page
      revalidatePath('/blog');
      console.log('✓ Revalidated /blog');
      
      // If a specific blog post is provided, revalidate it
      let slug = body.slug;
      
      // If slug not provided but title is, generate slug from title
      if (!slug && body.title) {
        slug = generateBlogSlug(body.title);
      }
      
      if (slug) {
        revalidatePath(`/blog/${slug}`);
        console.log(`✓ Revalidated /blog/${slug}`);
      }
      
      // Also revalidate the gallery/blogs page if it exists
      revalidatePath('/gallery/blogs');
      console.log('✓ Revalidated /gallery/blogs');
      
      return NextResponse.json({
        revalidated: true,
        paths: slug ? ['/blog', `/blog/${slug}`, '/gallery/blogs'] : ['/blog', '/gallery/blogs'],
        now: Date.now()
      });
    }
    
    return NextResponse.json(
      { message: 'Invalid type parameter' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret token' },
      { status: 401 }
    );
  }
  
  return NextResponse.json({
    message: 'Revalidation endpoint is working',
    usage: 'POST to this endpoint with { secret, type: "blog", slug: "your-slug" }'
  });
}
