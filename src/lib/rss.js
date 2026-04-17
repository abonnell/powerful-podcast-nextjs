import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    feed: [
      ['itunes:image', 'itunesImage', { keepArray: false, includeSnippet: false }],
    ],
    item: [
      ['itunes:duration', 'duration'],
      ['itunes:author', 'author'],
      ['itunes:episode', 'episodeNumber'],
      ['itunes:season', 'season'],
      ['itunes:image', 'itunesImage', { keepArray: false, includeSnippet: false }],
      ['itunes:explicit', 'explicit'],
      ['itunes:summary', 'summary'],
      ['itunes:subtitle', 'subtitle'],
      ['content:encoded', 'contentEncoded'],
    ]
  }
});

/**
 * Fetch and parse the podcast RSS feed
 * @returns {Promise<{title: string, description: string, image: string, episodes: Array}>}
 */
export async function getPodcastFeed() {
  const RSS_FEED_URL = process.env.RSS_FEED_URL;
  
  if (!RSS_FEED_URL) {
    console.error('RSS_FEED_URL environment variable is not set');
    return { episodes: [] };
  }
  
  try {
    // Fetch raw XML to extract itunes:image manually
    const response = await fetch(RSS_FEED_URL, {
      next: {
        revalidate: 14400, // 4 hours
      },
    });
    const xmlText = await response.text();
    
    // Extract all itunes:image hrefs from the XML
    const imageMatches = [...xmlText.matchAll(/<itunes:image\s+href="([^"]+)"/g)];
    const imageUrls = imageMatches.map(match => match[1]);
    
    // Now parse with rss-parser
    const feed = await parser.parseString(xmlText);
    
    // Extract feed-level iTunes image (first one should be the feed image)
    const feedImage = imageUrls[0] || feed.image?.url;
    
    return {
      title: feed.title,
      description: feed.description,
      image: feedImage,
      episodes: feed.items.map((item, index) => {
        // Extract episode number from title if it contains "Ep" followed by a number
        let episodeNumber = item.episodeNumber;
        if (!episodeNumber && item.title) {
          const match = item.title.match(/Ep(\d+)/i);
          if (match) {
            episodeNumber = match[1];
          }
        }
        
        // Get episode image - skip first image (that's the feed image), then map by index
        // imageUrls[0] is feed image, imageUrls[1+] are episode images in order
        const episodeImage = imageUrls[index + 1] || feedImage;
        
        return {
          title: item.title,
          description: item.contentSnippet || item.summary || item.description,
          htmlDescription: item.contentEncoded || item.content || item.description,
          pubDate: item.pubDate,
          audioUrl: item.enclosure?.url,
          duration: item.duration || item.itunes?.duration,
          episodeNumber: episodeNumber || (feed.items.length - index),
          season: item.season,
          image: episodeImage,
          link: item.link,
          guid: item.guid,
          author: item.author || feed.itunes?.author,
          explicit: item.explicit,
        };
      })
    };
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return { episodes: [] };
  }
}

/**
 * Generate a URL-safe slug from an episode title and number
 * @param {string} title - The episode title
 * @param {string|number} episodeNumber - The episode number
 * @returns {string} The generated slug
 */
export function generateEpisodeSlug(title, episodeNumber) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 30)
    .replace(/-$/, '');
  
  // Subtract 5 from episode number to match written episode numbers
  const adjustedNumber = episodeNumber ? parseInt(episodeNumber, 10) - 5 : null;
  
  return adjustedNumber ? `${adjustedNumber}-${slug}` : slug;
}
