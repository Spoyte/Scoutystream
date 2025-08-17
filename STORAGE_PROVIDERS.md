# Storage Providers Guide

ScoutyStream now supports multiple storage providers as alternatives to AWS S3. This guide explains how to configure and use each provider.

## Overview

The platform supports three storage providers:

1. **AWS S3** - Traditional cloud storage (original implementation)
2. **YouTube** - Direct video uploads to YouTube for hosting and streaming
3. **Walrus** - Decentralized blob storage on the Sui blockchain

## Configuration

Set the `STORAGE_PROVIDER` environment variable to choose your provider:

```bash
# Options: aws, youtube, walrus
STORAGE_PROVIDER=youtube
```

## AWS S3 (Default)

Traditional cloud storage with pre-signed URLs for uploads and downloads.

### Setup

1. Create an AWS account and S3 bucket
2. Create IAM user with S3 permissions
3. Configure environment variables:

```bash
STORAGE_PROVIDER=aws
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=your_bucket_name
```

### Features
- ✅ Pre-signed upload URLs
- ✅ HLS streaming support
- ✅ Thumbnail generation
- ✅ Direct file access

## YouTube

Upload videos directly to YouTube for hosting and streaming.

### Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable YouTube Data API v3

2. **Create OAuth 2.0 Credentials**
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID (Desktop application)
   - Note the Client ID and Client Secret

3. **Configure Environment Variables**
   ```bash
   STORAGE_PROVIDER=youtube
   YOUTUBE_CLIENT_ID=your_client_id
   YOUTUBE_CLIENT_SECRET=your_client_secret
   YOUTUBE_REDIRECT_URI=http://localhost:4000/api/storage/youtube/callback
   YOUTUBE_CHANNEL_ID=your_channel_id
   ```

4. **Get Refresh Token**
   ```bash
   # Start the API server
   npm run dev
   
   # Get authorization URL
   curl http://localhost:4000/api/storage/youtube/auth-url
   
   # Visit the URL, authorize, and get the code
   # Exchange code for tokens
   curl -X POST http://localhost:4000/api/storage/youtube/tokens \
     -H "Content-Type: application/json" \
     -d '{"code":"your_authorization_code"}'
   
   # Save the refresh_token in your environment
   YOUTUBE_REFRESH_TOKEN=your_refresh_token
   ```

### Features
- ✅ Direct YouTube uploads
- ✅ Automatic thumbnail generation
- ✅ YouTube embed URLs for streaming
- ✅ Public/private video controls
- ⚠️ Requires YouTube API quota management
- ⚠️ Subject to YouTube's content policies

### Limitations
- Videos default to private until YouTube audit approval
- API quotas limit upload frequency
- Content must comply with YouTube policies

## Walrus

Decentralized blob storage on the Sui blockchain ecosystem.

### Setup

1. **Configure Environment Variables**
   ```bash
   STORAGE_PROVIDER=walrus
   WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
   WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
   WALRUS_EPOCHS=5
   ```

2. **Test Connectivity**
   ```bash
   curl http://localhost:4000/api/storage/walrus/info
   ```

### Features
- ✅ Decentralized storage
- ✅ Content-addressed by blob ID
- ✅ Redundant storage with erasure coding
- ✅ No single point of failure
- ⚠️ Currently in testnet phase
- ⚠️ Limited HLS streaming support

### How It Works
1. Videos are uploaded as blobs to Walrus publishers
2. Blobs are stored with erasure coding across the network
3. Content is retrieved via aggregator nodes
4. Each blob gets a unique ID for future access

## API Endpoints

### Storage Information
```bash
GET /api/storage/info
```
Returns current provider configuration and status.

### Provider Testing
```bash
GET /api/storage/test
```
Tests connectivity and basic operations for the current provider.

### YouTube-Specific Endpoints
```bash
# Get OAuth authorization URL
GET /api/storage/youtube/auth-url

# Exchange authorization code for tokens
POST /api/storage/youtube/tokens
Body: {"code": "authorization_code"}
```

### Walrus-Specific Endpoints
```bash
# Get network information
GET /api/storage/walrus/info

# Get blob information
GET /api/storage/walrus/blob/{blobId}
```

## Switching Providers

To switch storage providers:

1. Update the `STORAGE_PROVIDER` environment variable
2. Configure the new provider's settings
3. Restart the API server
4. Test the new provider: `GET /api/storage/test`

## Development Notes

### Upload Flow Differences

**AWS S3:**
```
1. Generate pre-signed URL
2. Client uploads directly to S3
3. Commit upload with metadata
```

**YouTube:**
```
1. Generate placeholder URL
2. Client indicates upload ready
3. Server uploads to YouTube with metadata
```

**Walrus:**
```
1. Generate publisher endpoint URL
2. Client indicates upload ready
3. Server uploads to Walrus network
```

### Video Access Patterns

**AWS S3:** Pre-signed URLs for direct access
**YouTube:** YouTube embed URLs or direct links
**Walrus:** Aggregator URLs with blob IDs

## Production Considerations

### AWS S3
- Set up CloudFront CDN for better performance
- Configure lifecycle policies for cost optimization
- Monitor bandwidth costs

### YouTube
- Apply for API audit to enable public uploads
- Monitor API quotas and implement rate limiting
- Consider content backup strategy

### Walrus
- Monitor network stability (testnet)
- Plan for mainnet migration
- Consider hybrid approach with fallback storage

## Troubleshooting

### Common Issues

**YouTube OAuth Errors:**
- Verify redirect URI matches exactly
- Check client ID and secret
- Ensure YouTube Data API is enabled

**Walrus Network Issues:**
- Check publisher/aggregator URLs
- Verify network connectivity
- Monitor Walrus testnet status

**AWS S3 Permission Errors:**
- Verify IAM user permissions
- Check bucket policies
- Confirm region settings

### Debug Mode

Enable debug logging:
```bash
NODE_ENV=development
```

This will show detailed provider initialization and operation logs.

## Future Roadmap

- [ ] Multi-provider redundancy
- [ ] Automatic failover between providers
- [ ] Hybrid storage strategies
- [ ] Enhanced Walrus HLS support
- [ ] YouTube Shorts integration
- [ ] IPFS integration
- [ ] Custom CDN support

## Support

For provider-specific issues:
- **AWS S3:** Check AWS documentation and IAM permissions
- **YouTube:** Review Google Cloud Console and API quotas
- **Walrus:** Monitor Sui/Walrus network status and documentation

For general integration issues, check the API logs and use the `/api/storage/test` endpoint to diagnose connectivity problems.