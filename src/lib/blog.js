/**
 * Generate a URL-safe slug from a blog title
 * @param {string} title - The blog title
 * @returns {string} The generated slug
 */
export function generateBlogSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 72) // Cap at 72 characters
    .replace(/-$/, ''); // Remove trailing hyphen if any
}

/**
 * Extract preview text from HTML body
 * @param {string} htmlBody - The HTML content
 * @param {number} maxLength - Maximum length of preview text
 * @returns {string} The preview text with ellipsis if truncated
 */
export function getPreviewText(htmlBody, maxLength = 100) {
  if (!htmlBody) return '';
  
  // First, try to extract lead paragraphs (those marked with data-lead="true")
  const leadMatch = htmlBody.match(/<p[^>]*data-lead="true"[^>]*>(.*?)<\/p>/i);
  let text = '';
  
  if (leadMatch && leadMatch[1]) {
    // Use lead paragraph if available
    text = leadMatch[1];
  } else {
    // Otherwise, extract all paragraph content, skipping headings
    // Remove headings first
    let content = htmlBody.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, '');
    // Remove images
    content = content.replace(/<img[^>]*>/gi, '');
    // Remove horizontal rules
    content = content.replace(/<hr[^>]*>/gi, '');
    // Remove tables
    content = content.replace(/<table[^>]*>.*?<\/table>/gi, '');
    // Remove blockquotes (often just quotes, not main content)
    content = content.replace(/<blockquote[^>]*>.*?<\/blockquote>/gi, '');
    // Remove details/accordions
    content = content.replace(/<details[^>]*>.*?<\/details>/gi, '');
    
    // Extract paragraph text
    const paragraphs = content.match(/<p[^>]*>(.*?)<\/p>/gi) || [];
    
    // Get text from paragraphs, filtering out empty ones
    text = paragraphs
      .map(p => p.replace(/<[^>]*>/g, '')) // Strip HTML tags
      .map(p => p.trim()) // Trim whitespace
      .filter(p => p.length > 0) // Filter empty paragraphs
      .join(' '); // Join with spaces
  }
  
  // Strip any remaining HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Get first maxLength characters, trying to break at word boundary
  if (text.length <= maxLength) {
    return text;
  }
  
  const preview = text.substring(0, maxLength);
  const lastSpace = preview.lastIndexOf(' ');
  
  // Break at last space if it's not too far back
  if (lastSpace > maxLength * 0.8) {
    return preview.substring(0, lastSpace) + '...';
  }
  
  return preview + '...';
}
