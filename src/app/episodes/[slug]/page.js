import Image from "next/image";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { getAllEpisodes, getEpisodeBySlug } from "@/lib/data";

export const revalidate = 14400; // Revalidate every 4 hours

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
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      </div>
    </div>
  );
}
