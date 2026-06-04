export async function GET() {
  const RSS_FEED_URL = process.env.RSS_FEED_URL;

  if (!RSS_FEED_URL) {
    return new Response('RSS_FEED_URL not configured', { status: 500 });
  }

  try {
    const response = await fetch(RSS_FEED_URL);
    const xml = await response.text();

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml',
        'Content-Disposition': 'attachment; filename="powerful-podcast-rss.xml"',
      },
    });
  } catch (error) {
    return new Response('Failed to fetch RSS feed', { status: 500 });
  }
}
