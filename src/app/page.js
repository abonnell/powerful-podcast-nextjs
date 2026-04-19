import Image from "next/image";
import BannerDark from "@public/banner_dark.png";
import Episode from "@components/Episode/Episode.jsx";
import Blog from "@components/Blog/Blog.jsx";
import LogoImage from "@public/logo.png";
import Link from "next/link";
import strapi from "@/lib/strapi";
import { getPodcastFeed, generateEpisodeSlug } from "@/lib/rss";
import { generateBlogSlug, getPreviewText } from "@/lib/blog";

export const revalidate = 14400; // Revalidate every 4 hours

export default async function Home() {
  // Fetch episodes from RSS feed
  const { episodes: allEpisodes = [] } = await getPodcastFeed();
  
  // Get the 3 most recent episodes
  const recentEpisodes = allEpisodes
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, 3)
    .map(episode => ({
      ...episode,
      href: `/episodes/${generateEpisodeSlug(episode.title, episode.episodeNumber)}`
    }));

  let blogs = [];
  
  // Fetch blogs from Strapi
  try {
    const response = await strapi.find("blogs?populate=Cover&populate=createdBy");
    const strapiBlogs = response.data || [];
    
    // Transform Strapi blogs to component format
    blogs = strapiBlogs.map((blog) => {
      // Use Cover image from Strapi if available, otherwise fallback to logo.png
      let imgSrc = LogoImage;
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
  } catch (error) {
    console.error("Error fetching blogs from Strapi:", error);
  }

  return (
    <div>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      {/* Banner + title */}
      <div className="flex flex-col items-center justify-center py-8">
        <Image src={BannerDark} alt="Banner" width={500} height={300} />
        <h1 className="text-4xl font-bold mt-4" style={{display: "none"}}>powerful. the power metal podcast</h1>
      </div>
      {/* Container for episodes + blogs components */}
      <div className="flex justify-center">
        <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-0">
          <div id="episodes" className="mt-20 flex flex-col items-center">
            <h2 className="text-4xl font-bold mb-2 text-center">Episodes</h2>
            {recentEpisodes.map((episode, index) => (
              <div key={episode.guid || index} className="my-2">
                <Episode
                  img={episode.image}
                  imgAlt={episode.title}
                  title={episode.title}
                  href={episode.href}
                  duration={episode.duration}
                  pubDate={episode.pubDate}
                  description={episode.description}
                />
              </div>
            ))}
            <Link href="/episodes" className="text-primary-main hover:underline no-underline">
              See more...
            </Link>
          </div>
          <div id="blogs" className="mt-20 flex flex-col items-center">
            <h2 className="text-4xl font-bold mb-2 text-center">Blogs</h2>
            {blogs.map((blog, index) => (
              <div key={index} className="my-2">
                <Blog
                  img={blog.img}
                  imgAlt={blog.imgAlt}
                  title={blog.title}
                  href={blog.href}
                  previewText={blog.previewText}
                  author={blog.author}
                  createdAt={blog.createdAt}
                />
              </div>
            ))}
            <Link href="/blog" className="text-primary-main hover:underline no-underline">
              See more...
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
