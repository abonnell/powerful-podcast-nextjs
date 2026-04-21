import Image from "next/image";
import BannerDark from "@public/banner_dark.png";
import Episode from "@components/Episode/Episode.jsx";
import Blog from "@components/Blog/Blog.jsx";
import Link from "next/link";
import { getHomePageData } from "@/lib/data";

export const revalidate = 14400; // Revalidate every 4 hours

export default async function Home() {
  // Fetch all home page data from centralized data layer
  const { recentBlogs, recentEpisodes } = await getHomePageData();

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
            <Link href="/episodes" className="hover:text-primary-main transition-colors cursor-pointer group">
              <h2 className="text-4xl font-bold mb-8 text-center">Episodes →</h2>
            </Link>
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
          </div>
          <div id="blogs" className="mt-20 flex flex-col items-center">
            <Link href="/blog" className="hover:text-primary-main transition-colors cursor-pointer group">
              <h2 className="text-4xl font-bold mb-8 text-center">Blogs →</h2>
            </Link>
            {recentBlogs.map((blog, index) => (
              <div key={blog.id || index} className="my-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
