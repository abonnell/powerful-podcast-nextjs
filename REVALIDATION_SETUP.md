# On-Demand Revalidation Setup

This guide explains how to configure Strapi webhooks to automatically revalidate blog posts on your Next.js site when they're published or updated.

## How It Works

When a blog post is published or updated in Strapi, a webhook will trigger the revalidation endpoint, which uses Next.js's `revalidatePath` to regenerate the affected pages instantly.

## Setup Instructions

### 1. Configure the Revalidation Secret

**Important**: Change the `REVALIDATION_SECRET` in your `.env` file to a strong, random token:

```env
REVALIDATION_SECRET=your-actual-secret-token-here
```

Generate a secure token using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Make sure to add this same secret to your production environment variables (e.g., Vercel, AWS, etc.).

### 2. Configure Strapi Webhook

1. Log into your Strapi admin panel at: ``

2. Navigate to **Settings** → **Webhooks**

3. Click **Add new webhook**

4. Configure the webhook:
   - **Name**: `Next.js Blog Revalidation`
   - **URL**: `https://your-nextjs-domain.com/api/revalidate`
     - For local development: `http://localhost:3000/api/revalidate`
     - For production: Use your actual domain
   - **Headers**: 
     ```json
     {
       "Content-Type": "application/json"
     }
     ```
   - **Events**: Select these events:
     - ☑ Entry Create (`entry.create`)
     - ☑ Entry Update (`entry.update`)
     - ☑ Entry Publish (`entry.publish`)
   
5. In the **Body** section, use this template:
   ```json
   {
     "secret": "your-actual-secret-token-here",
     "type": "blog",
     "title": "{{ entry.Title }}"
   }
   ```
   Replace `your-actual-secret-token-here` with the same secret from your `.env` file.

6. **Filter** the webhook to only trigger for blog entries:
   - Set Content-Type: `blog` (or whatever your blog content type is called in Strapi)

7. Click **Save**

### 3. Test the Webhook

#### Manual Testing (using curl):
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-actual-secret-token-here",
    "type": "blog",
    "title": "My Test Blog Post"
  }'
```

Expected response:
```json
{
  "revalidated": true,
  "paths": ["/blog", "/blog/my-test-blog-post", "/gallery/blogs"],
  "now": 1713542400000
}
```

#### Test in Strapi:
1. Create or update a blog post in Strapi
2. Check the Strapi webhook logs to see if it was triggered
3. Verify your Next.js site shows the updated content immediately

## API Endpoint Details

### Endpoint: `POST /api/revalidate`

**Request Body:**
```json
{
  "secret": "your-revalidation-secret",
  "type": "blog",
  "slug": "optional-custom-slug",
  "title": "Blog Post Title"
}
```

**Parameters:**
- `secret` (required): Must match `REVALIDATION_SECRET` environment variable
- `type` (required): Set to `"blog"` for blog revalidation
- `slug` (optional): Specific blog slug to revalidate
- `title` (optional): Blog title - will auto-generate slug if `slug` not provided

**Response:**
```json
{
  "revalidated": true,
  "paths": ["/blog", "/blog/my-post", "/gallery/blogs"],
  "now": 1713542400000
}
```

### What Gets Revalidated

When a blog post is updated, the following paths are automatically revalidated:
- `/blog` - Main blog listing page
- `/blog/[slug]` - The specific blog post page
- `/gallery/blogs` - Blog gallery page

## Troubleshooting

### Webhook not triggering
- Check Strapi webhook logs in Settings → Webhooks
- Verify the URL is correct and accessible
- Ensure the content type filter matches your blog content type

### "Invalid secret token" error
- Verify the secret in `.env` matches the secret in Strapi webhook body
- Restart your Next.js dev server after changing `.env`
- For production, verify the environment variable is set correctly

### Pages not updating
- Check your Next.js server logs for revalidation messages
- Verify the blog title/slug is correct
- Try manually visiting the page to trigger a fresh render

### Local Development with Strapi Cloud
For local development, you'll need to expose your local server to the internet for Strapi to reach it:

**Option 1: Using ngrok**
```bash
ngrok http 3000
```
Then use the ngrok URL in your Strapi webhook (e.g., `https://abc123.ngrok.io/api/revalidate`)

**Option 2: Using Strapi localhost webhooks**
If Strapi supports it, you can create a separate webhook for local development pointing to `http://localhost:3000/api/revalidate`, though this may not work with Strapi Cloud.

## Security Notes

- Never commit your `REVALIDATION_SECRET` to version control
- Use different secrets for development and production
- The secret token prevents unauthorized users from triggering expensive revalidation operations
- Consider adding rate limiting if needed for production

## Next Steps

After setup:
1. Update a blog post in Strapi
2. Check that it appears immediately on your live site
3. Monitor the revalidation logs to ensure everything is working
4. Consider adding webhooks for other content types (episodes, etc.) following the same pattern
