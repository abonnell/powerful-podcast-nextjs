const YOUTUBE_CHANNEL_ID = 'UCJzBHrQes5cQACLprX0eoEQ';
const YOUTUBE_API_HEADERS = {
  Referer: 'https://www.powerful-podcast.com/',
};

/**
 * Extract episode number from a title string
 * Matches patterns: "Ep80", "Ep. 48", "ep. 44", "ep 37", "Ep 40", "Eps 28-31"
 */
function extractEpisodeNumber(title) {
  if (!title) return null;
  const match = title.match(/Ep(?:isode)?\.?\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Extract YouTube video IDs from RSS HTML descriptions
 * Some older episodes embed YouTube links in their show notes
 */
function extractYoutubeIdFromHtml(html) {
  if (!html) return null;
  const match = html.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Fetch all videos from the YouTube channel's uploads playlist
 * Uses the YouTube Data API v3
 * @returns {Promise<Array<{videoId: string, title: string, publishedAt: string}>>}
 */
export async function getYoutubeVideos() {
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    console.error('YOUTUBE_API_KEY environment variable is not set');
    return [];
  }

  try {
    // Step 1: Get the uploads playlist ID for the channel
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YOUTUBE_CHANNEL_ID}&key=${API_KEY}`,
      { headers: YOUTUBE_API_HEADERS }
    );
    const channelData = await channelRes.json();

    if (!channelData.items?.length) {
      console.error('YouTube channel not found:', channelData);
      return [];
    }

    const uploadsId = channelData.items[0].contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsId) {
      console.error('No uploads playlist found for channel');
      return [];
    }

    // Step 2: Fetch all playlist items (paginated, max 50 per page)
    const videos = [];
    let pageToken = '';

    do {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=50&pageToken=${pageToken}&key=${API_KEY}`;
      const playlistRes = await fetch(url, { headers: YOUTUBE_API_HEADERS });
      const playlistData = await playlistRes.json();

      if (playlistData.error) {
        console.error('YouTube API error:', playlistData.error);
        return videos;
      }

      for (const item of playlistData.items || []) {
        videos.push({
          videoId: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          publishedAt: item.snippet.publishedAt,
        });
      }

      pageToken = playlistData.nextPageToken || '';
    } while (pageToken);

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}

/**
 * Match YouTube videos to RSS episodes by episode number
 * Also falls back to extracting YouTube IDs from RSS htmlDescription
 * @param {Array} youtubeVideos - Videos from getYoutubeVideos()
 * @param {Array} rssEpisodes - Episodes from getPodcastFeed()
 * @returns {Array} Episodes enriched with youtubeVideoId
 */
export function matchYoutubeToEpisodes(youtubeVideos, rssEpisodes) {
  const ytByNumber = new Map();

  for (const video of youtubeVideos) {
    const epNum = extractEpisodeNumber(video.title);
    if (epNum && !ytByNumber.has(epNum)) {
      ytByNumber.set(epNum, video.videoId);
    }
  }

  return rssEpisodes.map((episode) => {
    let youtubeVideoId = null;

    const rawNum = parseInt(episode.episodeNumber, 10);

    const titleNum = extractEpisodeNumber(episode.title);
    const adjustedNum = rawNum ? rawNum - 5 : null;

    if (titleNum && ytByNumber.has(titleNum)) {
      youtubeVideoId = ytByNumber.get(titleNum);
    } else if (adjustedNum && ytByNumber.has(adjustedNum)) {
      youtubeVideoId = ytByNumber.get(adjustedNum);
    } else if (rawNum && ytByNumber.has(rawNum)) {
      youtubeVideoId = ytByNumber.get(rawNum);
    }

    if (!youtubeVideoId) {
      youtubeVideoId = extractYoutubeIdFromHtml(episode.htmlDescription);
    }

    return {
      ...episode,
      youtubeVideoId,
    };
  });
}
