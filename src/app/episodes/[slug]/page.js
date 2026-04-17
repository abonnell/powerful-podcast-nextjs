import Image from "next/image";
import { getPodcastFeed, generateEpisodeSlug } from "@/lib/rss";
import { notFound } from "next/navigation";

export const revalidate = 14400; // Revalidate every 4 hours

export default async function EpisodePage({ params }) {
  const { slug } = params;
  const { episodes } = await getPodcastFeed();
  
  const episode = episodes.find(
    (ep) => generateEpisodeSlug(ep.title, ep.episodeNumber) === slug
  );
  
  if (!episode) {
    notFound();
  }

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
        {episode.image && (
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
        {episode.audioUrl && (
          <audio controls className="w-full mb-8">
            <source src={episode.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: episode.htmlDescription }}
        />
      </div>
    </div>
  );
}
