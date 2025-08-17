import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ScoutyStream – Project Infos',
  description: 'Detailed presentation of the ScoutyStream project (ETHGlobal New York submission)',
}

export default function InfosPage() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1>ScoutyStream – AI-Powered Sports Scouting Platform</h1>
      <p className="text-sm text-gray-500">ETHGlobal New York&nbsp;2024 submission</p>

      <h2>Project&nbsp;Overview</h2>
      <p>
        ScoutyStream is a decentralised platform that lets football clubs (and, soon, clubs from any
        sport) monetise high-value <em>training session</em> footage while giving professional scouts—human
        <strong>and</strong> AI—fine-grained, pay-per-view access. We combine on-chain access control,
        HTTP&nbsp;402 micropayments and AI-friendly endpoints to make scouting faster, cheaper and more
        data-driven.
      </p>

      <h2>Key&nbsp;Features</h2>
      <ul>
        <li>Blockchain-secured access control on <strong>Chiliz Spicy Testnet</strong></li>
        <li>HTTP&nbsp;402 &amp; Coinbase <x402 /> flow for friction-less micropayments</li>
        <li>Scout&nbsp;Credential NFTs on <strong>Flow</strong> to verify professional identity</li>
        <li>HLS streaming with pre-signed URLs &amp; granular pricing per video</li>
        <li>AI-ready API: 1&nbsp;FPS frame extraction, captions, metadata &amp; more</li>
        <li>Dual-wallet front-end (EVM + Flow) built with Next.js 13 &amp; Tailwind CSS</li>
      </ul>

      <h2>Architecture</h2>
      <p>The project is a full-stack monorepo:</p>
      <ul>
        <li><strong>Frontend</strong> &nbsp;—&nbsp; Next.js 13 app (this site) with TypeScript &amp; Wagmi</li>
        <li><strong>Backend</strong> &nbsp;—&nbsp; Express API that enforces access rules &amp; 402 flow</li>
        <li><strong>Storage</strong> &nbsp;—&nbsp; S3-compatible bucket storing HLS manifests &amp; segments</li>
        <li><strong>Smart-Contracts</strong>
          <ul>
            <li>VideoAccessControl.sol (Chiliz) – maps users ⇆ videos &amp; tracks purchases</li>
            <li>ScoutCredential.cdc (Flow) – mints verifiable scout NFTs</li>
          </ul>
        </li>
      </ul>

      <h2>Demo&nbsp;Flow</h2>
      <ol>
        <li>Connect Chiliz wallet ➜ Browse gallery ➜ Select video</li>
        <li>Backend replies <code>402 Payment&nbsp;Required</code></li>
        <li>Complete x402 payment ➜ Access NFT minted</li>
        <li>Stream video through signed HLS URL</li>
        <li>Optional: mint Scout Credential on Flow &amp; run AI agent demo</li>
      </ol>

      <h2>Prize&nbsp;Alignment</h2>
      <ul>
        <li><strong>Chiliz</strong> — Core access control smart-contract + sports-centric use-case</li>
        <li><strong>Coinbase CDP</strong> — x402 micropayment integration throughout the stack</li>
        <li><strong>Flow</strong> — Credential NFTs that unlock pro features</li>
      </ul>

      <h2>Roadmap</h2>
      <ul>
        <li>Production deployment with real x402 keys</li>
        <li>Computer-vision pipeline for automated player metrics</li>
        <li>Analytics dashboard for clubs &amp; scouts</li>
        <li>Mobile experience</li>
      </ul>

      <p>
        Read the full <Link href="/PROJECT_SUMMARY.md" className="text-blue-600">implementation&nbsp;summary</Link>
        or view the <Link href="https://github.com/your-org/scoutystream" target="_blank" rel="noopener noreferrer" className="text-blue-600">source&nbsp;code on&nbsp;GitHub</Link>.
      </p>
    </div>
  )
}