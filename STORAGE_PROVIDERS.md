# Storage Providers Guide

This project now supports multiple storage providers as alternatives to AWS S3. You can choose between:

- **AWS S3** - Traditional cloud storage
- **YouTube** - Video hosting platform
- **Walrus/MinIO** - Self-hosted S3-compatible storage
- **Mock** - Development/testing storage (default)

## Configuration

Set the `STORAGE_PROVIDER` environment variable to choose your provider:

```bash
STORAGE_PROVIDER=mock      # Development (default)
STORAGE_PROVIDER=aws       # AWS S3
STORAGE_PROVIDER=youtube   # YouTube
STORAGE_PROVIDER=walrus    # Walrus/MinIO
```

## 1. Mock Storage (Development)

**Default provider, no configuration needed.**

```bash
STORAGE_PROVIDER=mock
```

Perfect for development and testing. Returns mock URLs and doesn't require any external services.

## 2. YouTube Storage

**Store videos on YouTube and serve them through your platform.**

### Setup

1. **Get YouTube API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable YouTube Data API v3
   - Create credentials (API Key)

2. **Get Channel ID:**
   - Go to your YouTube channel
   - Copy the channel ID from the URL or About page

3. **Environment Variables:**
```bash
STORAGE_PROVIDER=youtube
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here
YOUTUBE_PLAYLIST_ID=optional_playlist_id
```

### Features

- Videos are uploaded to your YouTube channel
- Automatic thumbnail generation
- YouTube's CDN and streaming infrastructure
- Privacy controls (private/unlisted/public)
- No storage costs (YouTube handles storage)

### Limitations

- No HLS streaming (YouTube uses their own player)
- Upload process is different from direct S3 uploads
- Requires YouTube account and API setup

## 3. Walrus/MinIO Storage

**Self-hosted S3-compatible storage for complete control.**

### Setup

1. **Install MinIO:**
```bash
# Docker (recommended)
docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=password123" \
  minio/minio server /data --console-address ":9001"

# Or download from https://min.io/download
```

2. **Create Bucket:**
   - Access MinIO console at http://localhost:9001
   - Login with admin/password123
   - Create a new bucket (e.g., `scoutystream-dev`)

3. **Environment Variables:**
```bash
STORAGE_PROVIDER=walrus
WALRUS_ENDPOINT=http://localhost:9000
WALRUS_ACCESS_KEY_ID=admin
WALRUS_SECRET_ACCESS_KEY=password123
WALRUS_BUCKET=scoutystream-dev
WALRUS_REGION=us-east-1
WALRUS_USE_SSL=false
```

### Features

- Full S3 compatibility
- Self-hosted (no cloud costs)
- HLS streaming support
- Complete control over data
- Can be deployed on any server

### Production Considerations

- Set up proper SSL certificates
- Configure backup strategies
- Monitor disk usage
- Set up monitoring and alerting

## 4. AWS S3 (Legacy)

**Traditional cloud storage option.**

```bash
STORAGE_PROVIDER=aws
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=your_bucket_name
```

## API Endpoints

### Storage Configuration
- `GET /api/storage/config` - Get current storage configuration
- `GET /api/storage/status` - Get storage provider status
- `POST /api/storage/test` - Test storage provider connectivity

### Example Response
```json
{
  "success": true,
  "data": {
    "provider": "youtube",
    "apiKey": "***configured***",
    "channelId": "UC123456789",
    "playlistId": "PL123456789",
    "isConfigured": true
  }
}
```

## Switching Providers

You can switch storage providers at any time by changing the `STORAGE_PROVIDER` environment variable and restarting the server.

**Note:** Existing videos won't automatically migrate between providers. You'll need to implement a migration strategy if you want to move videos between storage systems.

## Development Workflow

1. **Start with Mock:**
   ```bash
   STORAGE_PROVIDER=mock
   ```

2. **Test with YouTube:**
   ```bash
   STORAGE_PROVIDER=youtube
   YOUTUBE_API_KEY=your_key
   YOUTUBE_CHANNEL_ID=your_channel
   ```

3. **Deploy with Walrus:**
   ```bash
   STORAGE_PROVIDER=walrus
   WALRUS_ENDPOINT=https://your-minio-server.com
   # ... other config
   ```

## Troubleshooting

### YouTube Issues
- Verify API key is correct
- Check channel ID format
- Ensure YouTube Data API v3 is enabled
- Check API quota limits

### Walrus Issues
- Verify endpoint URL is accessible
- Check credentials are correct
- Ensure bucket exists
- Check SSL configuration

### General Issues
- Verify `STORAGE_PROVIDER` is set correctly
- Check all required environment variables
- Restart server after configuration changes
- Check server logs for detailed error messages

## Cost Comparison

| Provider | Storage Cost | Bandwidth Cost | Setup Cost |
|----------|--------------|----------------|------------|
| Mock     | Free         | Free           | Free       |
| YouTube  | Free         | Free           | Free       |
| Walrus   | Free         | Free           | Server costs |
| AWS S3   | $0.023/GB   | $0.09/GB      | Free       |

## Security Considerations

- **YouTube:** Videos are stored on YouTube's servers
- **Walrus:** Complete control over data and access
- **AWS S3:** AWS security best practices apply
- **Mock:** No real data storage

Choose the provider that best fits your security requirements and budget constraints.