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
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

const strapi = {
  find: strapiFind,
};

export default strapi;
