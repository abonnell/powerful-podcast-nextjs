import { Suspense } from "react";
import EpisodeGrid from "@components/EpisodeGrid/EpisodeGrid.jsx";
import { getAllEpisodes } from "@/lib/data";

export const revalidate = 14400; // Revalidate every 4 hours

export default async function EpisodesPage() {
  // Fetch all episodes from centralized data layer
  const { episodes: episodesWithHrefs } = await getAllEpisodes();

  return (
    <div>
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">All Episodes</h1>
        
        <Suspense fallback={<div className="text-center py-8">Loading episodes...</div>}>
          <EpisodeGrid episodes={episodesWithHrefs} />
        </Suspense>
      </div>
    </div>
  );
}
