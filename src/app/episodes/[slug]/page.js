import Image from "next/image";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { getAllEpisodes, getEpisodeBySlug } from "@/lib/data";


export const revalidate = 14400; // Revalidate every 4 hours

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const episode = await getEpisodeBySlug(slug);
  if (!episode) return {};

  const previewText = episode.htmlDescription
    ? episode.htmlDescription
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 200) + "..."
    : "";
  const image = typeof episode.image === "string" ? episode.image : "/logo.png";
  const publishedTime = episode.pubDate
    ? new Date(episode.pubDate).toISOString()
    : undefined;
  const dateStr = episode.pubDate
    ? new Date(episode.pubDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const description = dateStr ? `${dateStr}\n\n${previewText}` : previewText;

  return {
    title: `${episode.title} | powerful. the power metal podcast`,
    description,
    openGraph: {
      title: episode.title,
      description,
      images: [{ url: image, width: 400, height: 400 }],
      type: "article",
      publishedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: episode.title,
      description,
      images: [image],
    },
  };
}

// Generate static params for all episodes at build time
export async function generateStaticParams() {
  const { episodes } = await getAllEpisodes();
  
  return episodes.map((episode) => {
    // Extract slug from href (e.g., "/episodes/my-slug" -> "my-slug")
    const slug = episode.href.split('/').pop();
    return { slug };
  });
}

export default async function EpisodePage({ params }) {
  const { slug } = await params;
  
  // Fetch the specific episode using centralized data layer
  const episode = await getEpisodeBySlug(slug);
  
  if (!episode) {
    notFound();
  }

  // Sanitize HTML description to prevent XSS attacks
  const sanitizedDescription = sanitizeHtml(episode.htmlDescription, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'a': ['href', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });

  return (
    <div>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{episode.title}</h1>
        <div className="text-gray-600 dark:text-gray-400 mb-8">
          {new Date(episode.pubDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          {episode.duration && <span> • {episode.duration}</span>}
        </div>
        {!episode.youtubeVideoId && episode.image && (
          <div className="mb-8 flex justify-center">
            <Image
              src={episode.image}
              alt={episode.title}
              width={400}
              height={400}
              className="object-cover rounded-lg"
            />
          </div>
        )}
        {episode.youtubeVideoId ? (
          <div className="w-full mb-8 aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${episode.youtubeVideoId}`}
              title={episode.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        ) : episode.audioUrl && (
          <audio controls className="w-full mb-8">
            <source src={episode.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <a
            href="https://open.spotify.com/show/5DD8RTAFqA042qXGqRP0zN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1DB954] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify
          </a>
          <a
            href="https://podcasts.apple.com/us/podcast/powerful-a-power-metal-podcast/id1325183831"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#872EC4] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" viewBox="0 0 300 300" fill="currentColor">
              <g>
                <path d="M175.7,181.1c-0.4-3.6-1.6-6.2-4-8.6c-4.5-4.7-12.4-7.8-21.7-7.8c-9.3,0-17.2,3-21.7,7.8c-2.3,2.5-3.6,5-4,8.6c-0.8,7-0.3,13,0.5,22.7c0.8,9.2,2.3,21.5,4.2,33.9c1.4,8.9,2.5,13.7,3.5,17.1c1.7,5.6,7.8,10.4,17.5,10.4c9.7,0,15.9-4.9,17.5-10.4c1-3.4,2.1-8.2,3.5-17.1c1.9-12.5,3.4-24.7,4.2-33.9C176.1,194.1,176.5,188.1,175.7,181.1z"/>
                <path d="M174.6,130.1c0,13.6-11,24.6-24.6,24.6s-24.6-11-24.6-24.6c0-13.6,11-24.6,24.6-24.6S174.6,116.6,174.6,130.1z"/>
                <path d="M149.7,33.2C92.3,33.4,45.3,80,44.5,137.4c-0.6,46.5,29.1,86.3,70.6,100.9c1,0.4,2-0.5,1.9-1.5c-0.5-3.6-1.1-7.2-1.5-10.8c-0.2-1.3-1-2.3-2.1-2.9c-32.8-14.3-55.7-47.2-55.3-85.3c0.5-50,41.3-90.7,91.2-91.1c51.1-0.4,92.8,41,92.8,92c0,37.7-22.8,70.1-55.3,84.4c-1.2,0.5-2,1.6-2.1,2.9c-0.5,3.6-1,7.2-1.5,10.8c-0.2,1.1,0.9,1.9,1.9,1.5c41.1-14.4,70.6-53.6,70.6-99.6C255.5,80.5,208,33.1,149.7,33.2z"/>
                <path d="M147.3,68.2c-37.4,1.4-67.4,32.3-67.9,69.7c-0.3,24.6,12,46.4,30.9,59.3c0.9,0.6,2.2-0.1,2.2-1.2c-0.3-4.3-0.3-8.1-0.1-12.1c0.1-1.3-0.4-2.5-1.4-3.4c-11.5-10.8-18.5-26.2-18.1-43.2c0.8-30,24.9-54.4,54.9-55.6c32.6-1.3,59.4,24.9,59.4,57.1c0,16.4-7,31.2-18.1,41.7c-0.9,0.9-1.4,2.1-1.4,3.4c0.2,3.9,0.1,7.7-0.1,12c-0.1,1.1,1.2,1.9,2.2,1.2c18.6-12.7,30.9-34.2,30.9-58.4C220.8,98.9,187.5,66.6,147.3,68.2z"/>
              </g>
            </svg>
            Apple Podcasts
          </a>
          <a
            href="https://www.youtube.com/@powerfulpodcast?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF0000] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </a>
        </div>
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      </div>
    </div>
  );
}
