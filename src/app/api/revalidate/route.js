import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { generateBlogSlug } from '@/lib/blog';

// Simple in-memory rate limiter
// In production, consider using a Redis-based solution like @upstash/ratelimit
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 10; // Max 10 requests per minute

function checkRateLimit(identifier) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(identifier) || [];
  
  // Filter out requests outside the time window
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);
  
  // Cleanup old entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
      if (validTimestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }
  
  return true;
}

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
    // Rate limiting: Check if the request exceeds limits
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { message: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      );
    }
    
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
      // Always revalidate the home page
      revalidatePath('/');
      console.log('✓ Revalidated /');
      
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
        paths: slug ? ['/', '/blog', `/blog/${slug}`, '/gallery/blogs'] : ['/', '/blog', '/gallery/blogs'],
        now: Date.now()
      });
    }
    
    return NextResponse.json(
      { message: 'Invalid type parameter' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Revalidation error:', error);
    // Don't expose error details in production
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Error revalidating'
      : `Error revalidating: ${error.message}`;
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
