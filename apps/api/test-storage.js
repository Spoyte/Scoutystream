#!/usr/bin/env node

/**
 * Storage Provider Test Script
 * 
 * This script demonstrates how to test different storage providers
 * without needing to set up the full environment.
 */

import axios from 'axios'

const API_BASE = process.env.API_BASE_URL || 'http://localhost:4000'

async function testStorageProvider() {
  console.log('🧪 Testing Storage Provider Configuration\n')

  try {
    // Test storage info endpoint
    console.log('📋 Fetching storage provider information...')
    const infoResponse = await axios.get(`${API_BASE}/api/storage/info`)
    const storage = infoResponse.data.storage
    
    console.log(`Provider: ${storage.name} (${storage.provider})`)
    console.log(`Status: ${storage.isConfigured ? '✅ Configured' : '❌ Not Configured'}`)
    console.log(`Config:`, JSON.stringify(storage.config, null, 2))
    console.log()

    // Test storage connectivity
    console.log('🔧 Testing storage provider connectivity...')
    const testResponse = await axios.get(`${API_BASE}/api/storage/test`)
    const testResults = testResponse.data.testResults
    
    console.log(`Provider: ${testResults.name}`)
    console.log(`Configured: ${testResults.isConfigured ? '✅' : '❌'}`)
    console.log('\nTest Results:')
    
    Object.entries(testResults.tests).forEach(([testName, result]) => {
      const status = result.success ? '✅' : '❌'
      console.log(`  ${testName}: ${status}`)
      if (result.error) {
        console.log(`    Error: ${result.error}`)
      }
      if (result.url && result.success) {
        console.log(`    URL: ${result.url}`)
      }
    })

    // Provider-specific tests
    if (storage.provider === 'youtube') {
      console.log('\n🎥 YouTube-specific tests...')
      try {
        const authResponse = await axios.get(`${API_BASE}/api/storage/youtube/auth-url`)
        console.log('✅ YouTube auth URL generation works')
        console.log(`   Auth URL: ${authResponse.data.authUrl}`)
      } catch (error) {
        console.log('❌ YouTube auth URL generation failed')
        console.log(`   Error: ${error.response?.data?.message || error.message}`)
      }
    }

    if (storage.provider === 'walrus') {
      console.log('\n🐋 Walrus-specific tests...')
      try {
        const walrusResponse = await axios.get(`${API_BASE}/api/storage/walrus/info`)
        console.log('✅ Walrus network connection works')
        console.log('   Network Info:', JSON.stringify(walrusResponse.data.networkInfo, null, 2))
      } catch (error) {
        console.log('❌ Walrus network connection failed')
        console.log(`   Error: ${error.response?.data?.message || error.message}`)
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message)
    process.exit(1)
  }
}

async function demonstrateProviderSwitching() {
  console.log('\n🔄 Storage Provider Switching Demo\n')
  
  console.log('To switch storage providers, update your .env file:')
  console.log()
  console.log('For YouTube:')
  console.log('  STORAGE_PROVIDER=youtube')
  console.log('  YOUTUBE_CLIENT_ID=your_client_id')
  console.log('  YOUTUBE_CLIENT_SECRET=your_client_secret')
  console.log('  YOUTUBE_REFRESH_TOKEN=your_refresh_token')
  console.log()
  console.log('For Walrus:')
  console.log('  STORAGE_PROVIDER=walrus')
  console.log('  WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space')
  console.log('  WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space')
  console.log()
  console.log('For AWS S3 (default):')
  console.log('  STORAGE_PROVIDER=aws')
  console.log('  AWS_ACCESS_KEY_ID=your_access_key')
  console.log('  AWS_SECRET_ACCESS_KEY=your_secret_key')
  console.log('  S3_BUCKET=your_bucket')
  console.log()
  console.log('Then restart the API server: npm run dev')
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 ScoutyStream Storage Provider Test\n')
  
  testStorageProvider()
    .then(() => demonstrateProviderSwitching())
    .then(() => {
      console.log('\n✅ Test completed successfully!')
    })
    .catch((error) => {
      console.error('\n❌ Test failed:', error)
      process.exit(1)
    })
}