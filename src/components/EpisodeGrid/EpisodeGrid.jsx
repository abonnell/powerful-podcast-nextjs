"use client";

import Episode from "@components/Episode/Episode.jsx";
import SortableGrid from "@components/SortableGrid/SortableGrid.jsx";

export default function EpisodeGrid({ episodes }) {
  const sortOptions = [
    {
      value: "pubDate",
      label: "Date",
      compareFn: (a, b, sortOrder) => {
        const dateA = new Date(a.pubDate);
        const dateB = new Date(b.pubDate);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      },
    },
    {
      value: "title",
      label: "Title",
      compareFn: (a, b, sortOrder) => {
        return sortOrder === "desc"
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      },
    },
    {
      value: "duration",
      label: "Duration",
      compareFn: (a, b, sortOrder) => {
        // Convert duration string (HH:MM:SS) to seconds for comparison
        const toSeconds = (duration) => {
          if (!duration) return 0;
          const parts = duration.split(":").map((p) => parseInt(p, 10));
          if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
          } else if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
          }
          return 0;
        };
        const durationA = toSeconds(a.duration);
        const durationB = toSeconds(b.duration);
        return sortOrder === "desc"
          ? durationB - durationA
          : durationA - durationB;
      },
    },
  ];

  return (
    <SortableGrid
      items={episodes}
      sortOptions={sortOptions}
      defaultSortBy="pubDate"
      defaultSortOrder="desc"
      emptyMessage="No episodes found."
      renderItem={(episode) => (
        <Episode
          key={episode.guid}
          img={episode.image}
          imgAlt={episode.title}
          title={episode.title}
          href={episode.href}
          duration={episode.duration}
          pubDate={episode.pubDate}
          description={episode.description}
        />
      )}
    />
  );
}
