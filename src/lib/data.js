/**
 * Centralized data fetching and transformation layer
 * This module provides a single source of truth for fetching and transforming
 * data from Strapi and RSS feeds. Next.js automatically deduplicates identical
 * fetch calls during the same render, so calling these functions from multiple
 * pages won't result in duplicate network requests.
 */

import strapi from "@/lib/strapi";
import { getPodcastFeed, generateEpisodeSlug } from "@/lib/rss";
import { generateBlogSlug, getPreviewText } from "@/lib/blog";
import LogoImage from "@public/logo.png";

/**
 * Fetch all blogs from Strapi with standardized transformation
 * @returns {Promise<{blogs: Array, authors: Array}>}
 */
export async function getAllBlogs() {
  try {
    const response = await strapi.find("blogs?populate=Cover&populate=createdBy");
    const strapiBlogs = response.data || [];
    
    // Extract unique authors
    const authors = strapi.extractUniqueAuthors(strapiBlogs);
    
    // Transform Strapi blogs to standardized format
    const blogs = strapiBlogs.map((blog) => {
      // Use Cover image from Strapi if available, otherwise fallback to logo
      let imgSrc = LogoImage;
      if (blog.Cover?.url) {
        imgSrc = blog.Cover.url.startsWith('http') 
          ? blog.Cover.url 
          : `${process.env.STRAPI_BASE_PATH}${blog.Cover.url}`;
      }
      
      return {
        id: blog.id,
        img: imgSrc,
        imgAlt: blog.Title,
        title: blog.Title,
        slug: generateBlogSlug(blog.Title),
        href: `/blog/${generateBlogSlug(blog.Title)}`,
        previewText: getPreviewText(blog.Body, 100),
        author: blog.createdBy 
          ? `${blog.createdBy.firstname} ${blog.createdBy.lastname}` 
          : null,
        authorId: blog.createdBy?.id,
        createdAt: blog.createdAt,
        publishedAt: blog.publishedAt,
        rawBody: blog.Body,
      };
    });
    
    return { blogs, authors };
  } catch (error) {
    console.error("Error fetching blogs from Strapi:", error);
    return { blogs: [], authors: [] };
  }
}

/**
 * Get the most recent N blogs, sorted by creation date
 * @param {number} limit - Number of blogs to return (default: 3)
 * @returns {Promise<Array>}
 */
export async function getRecentBlogs(limit = 3) {
  const { blogs } = await getAllBlogs();
  return blogs
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}

/**
 * Fetch all episodes from RSS feed with standardized transformation
 * @returns {Promise<{episodes: Array, feedMeta: Object}>}
 */
export async function getAllEpisodes() {
  const feedData = await getPodcastFeed();
  const { episodes = [], ...feedMeta } = feedData;
  
  // Transform episodes to standardized format with hrefs
  const transformedEpisodes = episodes.map(episode => ({
    ...episode,
    image: episode.image || LogoImage,
    href: `/episodes/${generateEpisodeSlug(episode.title, episode.episodeNumber)}`,
  }));
  
  return { 
    episodes: transformedEpisodes, 
    feedMeta 
  };
}

/**
 * Get the most recent N episodes, sorted by publication date
 * @param {number} limit - Number of episodes to return (default: 3)
 * @returns {Promise<Array>}
 */
export async function getRecentEpisodes(limit = 3) {
  const { episodes } = await getAllEpisodes();
  return episodes
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, limit);
}

/**
 * Find a specific blog by its slug
 * @param {string} slug - The blog slug to find
 * @returns {Promise<Object|null>}
 */
export async function getBlogBySlug(slug) {
  const { blogs } = await getAllBlogs();
  return blogs.find(blog => blog.slug === slug) || null;
}

/**
 * Find a specific episode by its slug
 * @param {string} slug - The episode slug to find
 * @returns {Promise<Object|null>}
 */
export async function getEpisodeBySlug(slug) {
  const { episodes } = await getAllEpisodes();
  return episodes.find(episode => {
    const episodeSlug = generateEpisodeSlug(episode.title, episode.episodeNumber);
    return episodeSlug === slug;
  }) || null;
}

/**
 * Get all data needed for the home page in a single call
 * @returns {Promise<{recentBlogs: Array, recentEpisodes: Array}>}
 */
export async function getHomePageData() {
  // Next.js will automatically deduplicate these fetch calls if they're
  // called elsewhere during the same render
  const [recentBlogs, recentEpisodes] = await Promise.all([
    getRecentBlogs(3),
    getRecentEpisodes(3),
  ]);
  
  return { recentBlogs, recentEpisodes };
}
