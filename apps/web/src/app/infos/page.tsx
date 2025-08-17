import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Infos – ScoutyStream",
	description:
		"Detailed presentation of ScoutyStream, built for ETHGlobal New York: features, architecture, and roadmap.",
}

export default function InfosPage() {
	return (
		<div className="space-y-10">
			<header>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">ScoutyStream – Infos</h1>
				<p className="text-gray-600">A concise overview of the project crafted for ETHGlobal New York.</p>
			</header>

			<section className="space-y-4">
				<h2 className="text-2xl font-semibold text-gray-900">What is ScoutyStream?</h2>
				<p className="text-gray-700 leading-relaxed">
					ScoutyStream is an AI-powered sports scouting platform that lets clubs securely upload
					training sessions and share them with scouts and agents. Access to premium content is
					managed on-chain across EVM and Flow, enabling programmable, verifiable gating and
					seamless multi-chain wallets.
				</p>
			</section>

			<section className="space-y-4">
				<h2 className="text-2xl font-semibold text-gray-900">Key Features</h2>
				<ul className="list-disc pl-6 space-y-2 text-gray-700">
					<li>
						<strong>Gallery:</strong> Browse training videos with filters by sport, team, player, and
						text search.
					</li>
					<li>
						<strong>Upload pipeline:</strong> Clubs can upload content and manage visibility and
						access.
					</li>
					<li>
						<strong>Token-gated access:</strong> Cross-chain gating with EVM and Flow wallets for
						verifiable permissions.
					</li>
					<li>
						<strong>AI Agent demo:</strong> An agent that can summarize, analyze, and surface relevant
						clips for scouts.
					</li>
					<li>
						<strong>Profiles:</strong> Faucet-like demo profiles to quickly test different roles and
						permissions.
					</li>
				</ul>
			</section>

			<section className="space-y-4">
				<h2 className="text-2xl font-semibold text-gray-900">How It Works</h2>
				<ol className="list-decimal pl-6 space-y-2 text-gray-700">
					<li>Clubs upload training sessions via the Upload page.</li>
					<li>Content is indexed and displayed in the Gallery with rich filters.</li>
					<li>Access is checked on-chain; users connect with EVM or Flow wallets.</li>
					<li>Authorized users can play HLS streams and leverage AI insights.</li>
				</ol>
			</section>

			<section className="space-y-4">
				<h2 className="text-2xl font-semibold text-gray-900">Architecture</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
					<div className="rounded-lg border bg-white p-5 shadow-sm">
						<h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
						<ul className="list-disc pl-6 space-y-1">
							<li>Next.js App Router, React, Tailwind CSS</li>
							<li>Wallet connections for EVM and Flow</li>
							<li>HLS playback for smooth streaming</li>
						</ul>
					</div>
					<div className="rounded-lg border bg-white p-5 shadow-sm">
						<h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
						<ul className="list-disc pl-6 space-y-1">
							<li>API service for videos, filters, and metadata</li>
							<li>Extensible storage and transcoding pipeline</li>
							<li>Room for AI inference services</li>
						</ul>
					</div>
					<div className="rounded-lg border bg-white p-5 shadow-sm">
						<h3 className="font-semibold text-gray-900 mb-2">Blockchain</h3>
						<ul className="list-disc pl-6 space-y-1">
							<li>Flow and EVM contract examples in <code>contracts/</code></li>
							<li>On-chain gating for content access</li>
							<li>Upgradeable to more chains or token standards</li>
						</ul>
					</div>
					<div className="rounded-lg border bg-white p-5 shadow-sm">
						<h3 className="font-semibold text-gray-900 mb-2">Observability</h3>
						<ul className="list-disc pl-6 space-y-1">
							<li>Client-side error states and loading indicators</li>
							<li>Hook-based data fetching with graceful fallbacks</li>
						</ul>
					</div>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-2xl font-semibold text-gray-900">ETHGlobal New York</h2>
				<p className="text-gray-700 leading-relaxed">
					This project was built for ETHGlobal New York to showcase cross-chain media access
					control and practical AI-assisted scouting. The codebase is structured for fast demos
					while remaining production-upgradable.
				</p>
			</section>

			<section className="space-y-4">
				<h2 className="text-2xl font-semibold text-gray-900">Roadmap</h2>
				<ul className="list-disc pl-6 space-y-2 text-gray-700">
					<li>Advanced AI analysis (pose, event detection, player tracking)</li>
					<li>Granular access rules (time-limited, per-role, per-asset)</li>
					<li>Creator payouts and marketplace integrations</li>
					<li>Mobile-friendly uploader and live streaming</li>
				</ul>
			</section>

			<footer className="pt-6 border-t">
				<p className="text-sm text-gray-500">© {new Date().getFullYear()} ScoutyStream — Built for ETHGlobal New York.</p>
			</footer>
		</div>
	)
}