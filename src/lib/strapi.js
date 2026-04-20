/**
 * Fetch data from Strapi API with automatic caching and revalidation
 * @param {string} endpoint - The Strapi endpoint (e.g., "blogs")
 * @param {object} options - Additional fetch options
 * @returns {Promise<object>} The response data
 */
async function strapiFind(endpoint, options = {}) {
  const url = `${process.env.STRAPI_BASE_PATH}/api/${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 14400, // 4 hours
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Strapi API error details:', errorBody);
    throw new Error(`Strapi API error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  return response.json();
}

/**
 * Extract unique authors from blog posts
 * @param {Array} blogs - Array of blog data from Strapi
 * @returns {Array} Array of unique authors with id, firstname, lastname
 */
function extractUniqueAuthors(blogs) {
  const authorsMap = new Map();
  
  blogs.forEach(blog => {
    if (blog.createdBy) {
      const id = blog.createdBy.id;
      if (!authorsMap.has(id)) {
        authorsMap.set(id, {
          id: id,
          firstname: blog.createdBy.firstname || '',
          lastname: blog.createdBy.lastname || '',
        });
      }
    }
  });
  
  return Array.from(authorsMap.values());
}

const strapi = {
  find: strapiFind,
  extractUniqueAuthors: extractUniqueAuthors,
};

export default strapi;
