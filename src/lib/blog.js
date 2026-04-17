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
    .substring(0, 15) // Cap at 15 characters
    .replace(/-$/, ''); // Remove trailing hyphen if any
}

/**
 * Extract preview text from HTML body
 * @param {string} htmlBody - The HTML content
 * @param {number} maxLength - Maximum length of preview text
 * @returns {string} The preview text with ellipsis if truncated
 */
export function getPreviewText(htmlBody, maxLength = 100) {
  // Strip HTML tags
  const text = htmlBody.replace(/<[^>]*>/g, '');
  // Get first maxLength characters
  const preview = text.substring(0, maxLength);
  // Add ellipsis if truncated
  return preview.length < text.length ? preview + '...' : preview;
}
