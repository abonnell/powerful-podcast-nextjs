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
 * Extract text from TipTap JSON content
 * @param {object} content - The TipTap JSON content object
 * @returns {string} Plain text extracted from the content
 */
function extractTextFromTipTap(content) {
  if (!content || !content.content) return '';
  
  let text = '';
  
  // Recursively extract text from nodes
  function extractFromNode(node) {
    if (!node) return '';
    
    // If it's a text node, return its text
    if (node.type === 'text') {
      return node.text || '';
    }
    
    // Skip headings, images, blockquotes, tables for preview
    if (['heading', 'image', 'blockquote', 'table', 'horizontalRule'].includes(node.type)) {
      return '';
    }
    
    // If node has content array, process children
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractFromNode).join(' ');
    }
    
    return '';
  }
  
  // Extract text from all content nodes
  text = content.content.map(extractFromNode).join(' ');
  
  // Normalize whitespace
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Extract preview text from blog body (supports both HTML and TipTap JSON)
 * @param {string} body - The blog body content (HTML or TipTap JSON string)
 * @param {number} maxLength - Maximum length of preview text
 * @returns {string} The preview text with ellipsis if truncated
 */
export function getPreviewText(body, maxLength = 100) {
  if (!body) return '';
  
  let text = '';
  
  // Check if the body is TipTap JSON format
  try {
    const parsed = JSON.parse(body);
    if (parsed.type === 'doc' && parsed.content) {
      // It's TipTap JSON
      text = extractTextFromTipTap(parsed);
    } else {
      // Not TipTap format, treat as HTML
      throw new Error('Not TipTap format');
    }
  } catch (e) {
    // It's HTML or plain text, use original logic
    const leadMatch = body.match(/<p[^>]*data-lead="true"[^>]*>(.*?)<\/p>/i);
    
    if (leadMatch && leadMatch[1]) {
      text = leadMatch[1];
    } else {
      // Extract all paragraph content, skipping headings
      let content = body.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, '');
      content = content.replace(/<img[^>]*>/gi, '');
      content = content.replace(/<hr[^>]*>/gi, '');
      content = content.replace(/<table[^>]*>.*?<\/table>/gi, '');
      content = content.replace(/<blockquote[^>]*>.*?<\/blockquote>/gi, '');
      content = content.replace(/<details[^>]*>.*?<\/details>/gi, '');
      
      const paragraphs = content.match(/<p[^>]*>(.*?)<\/p>/gi) || [];
      
      text = paragraphs
        .map(p => p.replace(/<[^>]*>/g, ''))
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .join(' ');
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
  }
  
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
