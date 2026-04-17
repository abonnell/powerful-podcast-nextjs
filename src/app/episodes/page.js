import EpisodeGrid from "@components/EpisodeGrid/EpisodeGrid.jsx";
import { getPodcastFeed, generateEpisodeSlug } from "@/lib/rss";
import LogoImage from "@public/logo.png";

export const revalidate = 14400; // Revalidate every 4 hours

export default async function EpisodesPage() {
  const { episodes } = await getPodcastFeed();

  // Pre-generate hrefs on the server side
  const episodesWithHrefs = episodes.map(episode => ({
    ...episode,
    // Use episode-specific image if available, otherwise use static logo
    image: episode.image || LogoImage,
    href: `/episodes/${generateEpisodeSlug(episode.title, episode.episodeNumber)}`
  }));

  return (
    <div>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">All Episodes</h1>
        
        <EpisodeGrid episodes={episodesWithHrefs} />
      </div>
    </div>
  );
}
