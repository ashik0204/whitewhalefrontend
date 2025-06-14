# White Whaling Client

Frontend application for White Whaling platform.

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   
## Deployment

### Deploy to Netlify

#### Option 1: Deploy via CLI
1. Install Netlify CLI:
   ```
   npm install -g netlify-cli
   ```
2. Login to Netlify:
   ```
   netlify login
   ```
3. Deploy to Netlify:
   ```
   npm run netlify:deploy
   ```
4. For production deployment:
   ```
   npm run netlify:deploy:prod
   ```

#### Option 2: Deploy via Netlify UI
1. Build the project:
   ```
   npm run build
   ```
2. Deploy the `dist` folder on Netlify's website

### Environment Variables

Make sure to set the following environment variables on Netlify:

- `VITE_API_URL`: URL of your backend API on Render (e.g., https://your-render-backend-url.onrender.com)

## Backend Connection

This frontend application is configured to connect to a separate backend deployed on Render.
Make sure your backend is properly set up with CORS to allow requests from your Netlify domain.
