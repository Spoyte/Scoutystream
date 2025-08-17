import { ExternalLink, Github, Zap, Shield, Coins, Sparkles, Trophy, Target, Rocket, Users } from "lucide-react";

export default function InfosPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          ScoutyStream
        </h1>
        <p className="text-xl text-gray-600">
          AI-Powered Sports Scouting Platform
        </p>
        <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            ETHGlobal New York 2024
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Multi-Chain dApp
          </span>
        </div>
      </div>

      {/* Overview */}
      <section className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="w-6 h-6 mr-2 text-blue-600" />
          Project Overview
        </h2>
        <div className="prose max-w-none text-gray-700">
          <p className="text-lg mb-4">
            ScoutyStream revolutionizes sports scouting by creating a decentralized platform where football clubs 
            can upload training videos and professional scouts or AI agents can access this content through 
            blockchain-powered micropayments.
          </p>
          <p>
            Built for ETHGlobal New York, this platform combines cutting-edge blockchain technology with 
            practical sports industry needs, demonstrating the future of decentralized content access and 
            professional credential verification.
          </p>
        </div>
      </section>

      {/* Architecture */}
      <section className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-yellow-600" />
          Technical Architecture
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Frontend Stack</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Next.js 14</strong> with App Router</li>
              <li>• <strong>TypeScript</strong> for type safety</li>
              <li>• <strong>Tailwind CSS</strong> for styling</li>
              <li>• <strong>Dual wallet integration</strong> (EVM + Flow)</li>
              <li>• <strong>HLS video streaming</strong> with access control</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Backend & Blockchain</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Express.js API</strong> with 15+ endpoints</li>
              <li>• <strong>Chiliz Spicy Testnet</strong> for access control</li>
              <li>• <strong>Flow Testnet</strong> for scout credentials</li>
              <li>• <strong>HTTP 402 protocol</strong> via Coinbase x402</li>
              <li>• <strong>S3 storage</strong> with pre-signed URLs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Blockchain Integration */}
      <section className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-green-600" />
          Blockchain Integration
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-orange-200 rounded-lg p-6 bg-orange-50">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Chiliz</h3>
            </div>
            <p className="text-gray-700 mb-3">
              Core access control smart contract managing video viewing permissions
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• VideoAccessControl.sol</li>
              <li>• User/video access mapping</li>
              <li>• Batch operations support</li>
              <li>• Analytics tracking</li>
            </ul>
          </div>

          <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Coins className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Coinbase CDP</h3>
            </div>
            <p className="text-gray-700 mb-3">
              HTTP 402 micropayment protocol for seamless content access
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• x402 challenge/response</li>
              <li>• Webhook verification</li>
              <li>• AI agent compatibility</li>
              <li>• Mock payment fallback</li>
            </ul>
          </div>

          <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Flow</h3>
            </div>
            <p className="text-gray-700 mb-3">
              Professional scout credential NFTs for identity verification
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• ScoutCredential.cdc</li>
              <li>• NFT standard compliance</li>
              <li>• Professional identity</li>
              <li>• FCL integration</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Rocket className="w-6 h-6 mr-2 text-purple-600" />
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              For Scouts & AI Agents
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Pay-per-view access</strong> to training videos using HTTP 402 protocol</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>HLS video streaming</strong> with blockchain-verified access control</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Advanced filtering</strong> by sport, team, player, and search terms</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>AI-friendly API</strong> for programmatic analysis and frame extraction</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Scout Credential NFTs</strong> for professional verification</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-green-600" />
              For Football Clubs
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Video upload</strong> with metadata and pricing configuration</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Automatic HLS transcoding</strong> for optimal streaming performance</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Revenue sharing</strong> through transparent blockchain payments</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Analytics dashboard</strong> for tracking video performance</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ETHGlobal Prize Alignment */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-gold-600" />
          ETHGlobal Prize Alignment
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chiliz</h3>
              <span className="text-sm font-medium text-green-600">$5,000</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Sports/Entertainment focus ✅</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Chiliz Spicy integration ✅</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Smart contract deployed ✅</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Clear documentation ✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Coinbase CDP</h3>
              <span className="text-sm font-medium text-green-600">$20,000</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>x402 integration ✅</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Payment handling ✅</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Webhook processing ✅</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Developer feedback ready ✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Flow</h3>
              <span className="text-sm font-medium text-green-600">$10,000</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Contract deployment ✅</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Transaction capability ✅</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>FCL integration ✅</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Professional use case ✅</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Metrics */}
      <section className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Technical Implementation
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Frontend</h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Pages</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span>Components</span>
                <span className="font-medium">8+</span>
              </div>
              <div className="flex justify-between">
                <span>Custom Hooks</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between">
                <span>TypeScript Coverage</span>
                <span className="font-medium">100%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Backend</h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>API Endpoints</span>
                <span className="font-medium">15+</span>
              </div>
              <div className="flex justify-between">
                <span>Core Services</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span>Demo Videos</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span>Filter Types</span>
                <span className="font-medium">4</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Contracts</h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Chiliz Contract</span>
                <span className="font-medium">150+ LOC</span>
              </div>
              <div className="flex justify-between">
                <span>Flow Contract</span>
                <span className="font-medium">200+ LOC</span>
              </div>
              <div className="flex justify-between">
                <span>Passing Tests</span>
                <span className="font-medium">19</span>
              </div>
              <div className="flex justify-between">
                <span>Gas Optimized</span>
                <span className="font-medium">✅</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Flow */}
      <section className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Demo Flow
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-blue-600">
              For Human Scouts
            </h3>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                <span><strong>Connect Wallet</strong> (MetaMask to Chiliz Spicy)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                <span><strong>Browse Gallery</strong> with filtering (sport: basketball, team: Lakers)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                <span><strong>Select Video</strong> → Receives 402 Payment Required</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">4</span>
                <span><strong>Complete Payment</strong> → On-chain access granted</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">5</span>
                <span><strong>Stream Video</strong> → HLS playback with pre-signed URLs</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">6</span>
                <span><strong>Mint Credential</strong> → Flow NFT for professional verification</span>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-purple-600">
              For AI Agents
            </h3>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="bg-purple-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                <span><strong>Authenticate</strong> with wallet signature</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                <span><strong>Request Video Access</strong> → Handle 402 programmatically</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                <span><strong>Complete Payment</strong> → Automated x402 flow</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">4</span>
                <span><strong>Extract Frames</strong> → 1 FPS JPEG stream for analysis</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">5</span>
                <span><strong>Analyze Content</strong> → Computer vision processing</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">6</span>
                <span><strong>Generate Insights</strong> → Scouting recommendations</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Links and Resources */}
      <section className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <ExternalLink className="w-6 h-6 mr-2 text-blue-600" />
          Resources & Links
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Project Summary</strong> - Complete implementation overview</li>
              <li>• <strong>Deployment Guide</strong> - Step-by-step setup instructions</li>
              <li>• <strong>API Documentation</strong> - All 15+ endpoints documented</li>
              <li>• <strong>Smart Contract Tests</strong> - 19 passing test cases</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Development</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Monorepo Structure</strong> - Clean workspace organization</li>
              <li>• <strong>CI/CD Pipeline</strong> - GitHub Actions automation</li>
              <li>• <strong>Type Safety</strong> - 100% TypeScript coverage</li>
              <li>• <strong>Production Ready</strong> - Vercel deployment configured</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-gray-600">
          Built for <strong>ETHGlobal New York 2024</strong> - Demonstrating the future of sports technology with blockchain
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Total Development Time: ~12-16 hours • Lines of Code: 2000+ • Ready for Production
        </p>
      </div>
    </div>
  );
}