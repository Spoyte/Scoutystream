## Implementation Guide — ScoutyStream

This is a concrete, end‑to‑end build plan derived from `general-plan.md`. It prioritizes the frontend (Next.js on Vercel), adds CI via GitHub Actions, and then covers the backend, Chiliz contracts, and the minimal Flow module.

### Conventions
- Monorepo using pnpm workspaces.
- Node 20 LTS.
- TypeScript everywhere.
- Keep secrets out of the repo; use `.env` locally, Vercel/CI secrets in dashboards.

---

### Part A — Frontend (Next.js) [largest section]

#### A1. Create the Next.js app (apps/web)
1) In the monorepo root, scaffold the web app:
```bash
pnpm dlx create-next-app@latest apps/web --typescript --eslint --app --src-dir --import-alias "@/*" --tailwind=false
```
2) Ensure Node 20 in `apps/web/package.json` engines: `{ "node": ">=20" }`.
3) Install deps used by the plan:
```bash
cd apps/web
pnpm add zustand swr axios hls.js
pnpm add viem wagmi @tanstack/react-query
pnpm add next-seo clsx
pnpm add @coinbase/x402-sdk # placeholder; use actual package name per Coinbase docs
pnpm add @onflow/fcl
pnpm add -D @types/hls.js @types/node @types/react @types/react-dom
```
4) Create a minimal `vercel.json` so Vercel knows this is the root for deployment:
```json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```
Place it in `apps/web/vercel.json`.

5) Add scripts to `apps/web/package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

#### A2. App layout and routing
1) Use App Router structure under `apps/web/src/app`:
- `layout.tsx`: app‑wide layout (header/nav/footer), wallet connect buttons (EVM + Flow), and SEO baseline.
- `page.tsx`: Gallery page.
- `video/[id]/page.tsx`: Video view page with HLS playback and 402 handling.
- `club/upload/page.tsx`: Club upload flow (client-side UI, calls backend pre‑signed URL endpoints).
- `profile/page.tsx`: Flow wallet connect + mint “Scout Credential”.
- `agent/page.tsx`: Agent demo page to showcase programmatic 402 handling + frames download.

2) Shared UI/components under `apps/web/src/components`:
- `WalletConnectEvm.tsx`: Connect/disconnect to Chiliz Spicy network.
- `WalletConnectFlow.tsx`: FCL connect/disconnect.
- `VideoCard.tsx`, `VideoGrid.tsx`.
- `HlsPlayer.tsx`: wraps `<video>` + `hls.js` attach logic with Safari fallback.
- `PaywallButton.tsx`: shows price, triggers 402 payment flow.

3) Shared hooks/utilities under `apps/web/src/lib` and `apps/web/src/hooks`:
- `chains/chilizSpicy.ts`: chain constants for wagmi/viem (RPC URL, chain id, currency).
- `useEvmWallet.ts`: connect, chain switch/add, address state.
- `useX402.ts`: handle 402 response and x402 challenge resolution (abstract Coinbase SDK calls).
- `useApi.ts`: Axios instance with baseURL, interceptors to surface 402 responses to `useX402`.
- `fcl.ts`: FCL configuration for Flow Testnet.

4) Add SEO baseline with `next-seo` in `layout.tsx` and per‑page overrides if needed.

#### A3. EVM wallet (Chiliz Spicy) integration
1) Define the Chiliz Spicy testnet chain config (placeholder values; fill from Chiliz docs):
- `id`: CHILIZ_SPICY_CHAIN_ID (env)
- `rpcUrls.default.http`: `process.env.NEXT_PUBLIC_CHILIZ_RPC_URL`
- `name`: "Chiliz Spicy Testnet"
- `nativeCurrency`: `{ name: "CHZ", symbol: "CHZ", decimals: 18 }`

2) Initialize wagmi + viem in a providers file `apps/web/src/providers/WagmiProvider.tsx` with the custom chain and injected connector.
3) In `layout.tsx`, wrap the app with Wagmi and React Query providers.
4) Build `WalletConnectEvm.tsx` that can:
- Connect/disconnect.
- If wallet is on the wrong network, prompt to add/switch chain via `ethereum.request({ method: 'wallet_addEthereumChain', params: [...] })`.
- Display connected address truncated.

#### A4. Flow wallet (FCL) integration (minimal)
1) Create `apps/web/src/lib/fcl.ts`:
- Configure Testnet access node and discovery wallet URLs.
- Export `login`, `logout`, `currentUser`.
2) `WalletConnectFlow.tsx` component with simple connect/disconnect UI and user address display.
3) `profile/page.tsx` includes a "Mint Scout Credential" button that calls the backend (or directly FCL transaction in stretch) to mint.

#### A5. Data fetching and global state
1) Create `apps/web/src/lib/api.ts` with Axios instance pointing to the backend API base URL (env: `NEXT_PUBLIC_API_BASE_URL`).
2) Add Axios interceptor to detect `402` responses and forward to `useX402`.
3) Use SWR or React Query for:
- `GET /api/videos` on the Gallery page.
- `GET /api/videos/:id` in the Video page to display metadata/access state.

#### A6. HLS playback component
1) Implement `HlsPlayer.tsx`:
- If Safari or native HLS support: set `src` on `<video>` directly to the HLS manifest URL.
- Else instantiate `Hls` from `hls.js`, attach media, and load source.
- Accepts `manifestUrl`, `poster`, optional `onError`.
2) Ensure the component can swap `manifestUrl` when revalidated after payment.

#### A7. 402/x402 client flow
1) On `video/[id]/page.tsx`, when "Watch" is clicked:
- Attempt `GET /api/videos/:id/manifest`.
- If 200, set player `manifestUrl` and play.
- If 402, pass the response to `useX402`.
2) `useX402` responsibilities:
- Parse x402 challenge headers (names per Coinbase docs; keep them abstracted behind this hook).
- Initialize Coinbase SDK flow/modal for payment.
- Receive payment receipt/proof.
- Call `POST /api/payments/x402/verify` with `{ videoId, receipt }`.
- On success, re‑fetch manifest.
3) If `PAYMENT_PROVIDER=mock`, skip SDK and call `POST /api/videos/:id/purchase` (dev‑only), then re‑fetch manifest.

#### A8. Upload flow (clubs)
1) `club/upload/page.tsx`:
- Step 1: Call `POST /api/uploads/request` with filename, size, mime; receive `{ uploadUrl, videoId }`.
- Step 2: Use `fetch(uploadUrl, { method: 'PUT', body: file })` to upload directly to S3.
- Step 3: Call `POST /api/uploads/commit` with `{ videoId, title, description, tags }` to trigger HLS transcode and metadata save.
2) Show upload progress and a success confirmation with a link to the new video page.

#### A9. Agent demo page
1) `agent/page.tsx` offers a button to run a scripted flow:
- Calls `GET /api/videos/:id/manifest` (expects 402).
- Resolves payment (x402 or mock) programmatically without UI.
- After access, calls `GET /api/videos/:id/frames?fps=1` and renders the first few thumbnails in the UI.
2) Add small, optional CV stub: call a demo API that returns mocked action labels and show them.

#### A10. Frontend env vars and Vercel setup
1) Add `apps/web/.env.local.example` with:
```
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_CHILIZ_RPC_URL=
NEXT_PUBLIC_CHILIZ_CHAIN_ID=
NEXT_PUBLIC_X402_ENV=test
NEXT_PUBLIC_FLOW_ACCESS_NODE=
NEXT_PUBLIC_FLOW_WALLET_URL=
```
2) In Vercel dashboard (Project → Settings → Environment Variables), add the above with appropriate values.
3) Link GitHub repo to Vercel; select `apps/web` as the project root. Build Command: `pnpm build`, Output: `.next`.

#### A11. Frontend quality gates
1) ESLint config: keep Next.js defaults; add simple rules for hooks and imports.
2) Typecheck in CI: `pnpm --filter web typecheck`.
3) Optional visual polish: basic CSS using Tailwind (if added) or vanilla CSS modules.

---

### Part B — GitHub Actions (CI/CD)

#### B1. Monorepo setup
1) At repo root, create `package.json` with workspaces:
```json
{
  "private": true,
  "packageManager": "pnpm@9",
  "workspaces": ["apps/*", "contracts/*"]
}
```
2) Commit a lockfile by running `pnpm i` once at root after packages are present.

#### B2. CI workflow
1) Create `.github/workflows/ci.yml`:
```yaml
name: ci
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  setup-build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - name: Install deps
        run: pnpm install --frozen-lockfile

      - name: Lint web
        run: pnpm --filter web lint

      - name: Typecheck web
        run: pnpm --filter web typecheck

      - name: Build web
        run: pnpm --filter web build

      # Optional place‑holders for api and contracts once added
      - name: Typecheck api
        run: pnpm --filter api typecheck || true

      - name: Build api
        run: pnpm --filter api build || true

      - name: Contracts compile
        run: pnpm --filter chiliz compile || true
```
2) If you want Vercel preview deployments via Actions (optional, normally use Vercel GitHub app):
- Add secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (web project).
- Add a deploy job after build:
```yaml
  deploy-preview:
    needs: setup-build-test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Vercel deploy (preview)
        run: |
          pnpm add -g vercel@latest
          cd apps/web
          vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
          vercel build --token=${{ secrets.VERCEL_TOKEN }}
          vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

### Part C — Backend (apps/api)

#### C1. Scaffold API
1) Create Express app in `apps/api`:
```bash
pnpm dlx tsx -v >/dev/null 2>&1 || pnpm add -D tsx
mkdir -p apps/api/src
pnpm add express cors morgan axios aws-sdk @aws-sdk/client-s3 @aws-sdk/s3-request-presigner zod
pnpm add ethers
pnpm add -D typescript tsx ts-node-dev @types/node @types/express @types/cors @types/morgan
```
2) `apps/api/package.json` scripts:
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p .",
    "start": "node dist/index.js",
    "typecheck": "tsc -p . --noEmit"
  }
}
```
3) Create `apps/api/tsconfig.json` with NodeNext module resolution.

#### C2. API routes
Implement the following (controllers can be split by folder):
- `GET /api/health` → uptime/version.
- `GET /api/videos` → list public metadata.
- `GET /api/videos/:id` → metadata + `hasAccess` by calling `checkAccess` on Chiliz.
- `GET /api/videos/:id/manifest` →
  - If access: generate short‑lived S3 pre‑signed URL to HLS manifest and return 200 JSON with `manifestUrl` (or redirect 302 to signed URL).
  - If no access: respond 402 with Coinbase x402 challenge headers (names/values per Coinbase docs).
- `POST /api/payments/x402/verify` → verify receipt with Coinbase; if valid, call `grantAccess` on chain; return 200.
- `POST /api/payments/webhook` → Coinbase webhook handler; verify signature; on confirmed payment, idempotently `grantAccess`.
- `POST /api/videos/:id/purchase` (dev/mock) → if `PAYMENT_PROVIDER=mock`, directly grant on chain.
- Uploads:
  - `POST /api/uploads/request` → S3 pre‑signed PUT, returns `{ uploadUrl, videoId }`.
  - `POST /api/uploads/commit` → start transcode to HLS (node‑ffmpeg or job runner); save metadata.
- Agent helpers:
  - `GET /api/videos/:id/frames?fps=1` → streams JPEGs/zip (ensure access first).
  - `GET /api/videos/:id/captions` → returns VTT/SRT from storage if present (ensure access first).

#### C3. Chiliz on‑chain integration
1) Load `VideoAccessControl` ABI + address from env.
2) Create an `ethers.Wallet` from `CHILIZ_DEPLOYER_PRIVATE_KEY` connected to `CHILIZ_RPC_URL`.
3) Implement `checkAccess(user, videoId)` and `grantAccess(user, videoId)` wrappers with logging.
4) Ensure idempotency: if already has access, `grantAccess` is a no‑op in code (or allowed but harmless on chain).

#### C4. x402 integration points
1) 402 responses include Coinbase x402 challenge headers. Keep a helper that formats headers exactly as required (one place to change as docs evolve).
2) Verification:
- `POST /api/payments/x402/verify` receives `{ videoId, receipt }`.
- Server verifies via Coinbase (HTTP call or SDK) using `COINBASE_X402_API_KEY`.
- On success: `grantAccess(user, videoId)`.
3) Webhook: verify signature `COINBASE_WEBHOOK_SECRET`; handle duplicate events safely.

#### C5. Storage integration (S3 compatible)
1) Use AWS SDK v3 S3 client.
2) For manifest/segment serving, generate pre‑signed GET URLs with 120–300s TTL.
3) For uploads, generate pre‑signed PUT URLs; limit size and content‑type.
4) HLS transcode: simplest path is to run ffmpeg on the server right after `commit` (OK for demo). For scale, note MediaConvert as future work.

#### C6. API env
Create `apps/api/.env.example`:
```
PORT=4000
API_BASE_URL=http://localhost:4000
CHILIZ_RPC_URL=
CHILIZ_CHAIN_ID=
CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS=
CHILIZ_DEPLOYER_PRIVATE_KEY=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=

PAYMENT_PROVIDER=x402
COINBASE_X402_API_KEY=
COINBASE_WEBHOOK_SECRET=
COINBASE_ENV=test
```

---

### Part D — Chiliz Smart Contract (contracts/chiliz)

#### D1. Scaffold Hardhat project
```bash
mkdir -p contracts/chiliz
cd contracts/chiliz
pnpm dlx hardhat@latest
# choose TypeScript project
pnpm add @nomicfoundation/hardhat-toolbox dotenv
```

#### D2. Implement `VideoAccessControl.sol`
- Storage: `mapping(uint256 => mapping(address => bool)) hasAccess`.
- Functions: `grantAccess`, `grantAccessBatch`, `revokeAccess` (optional), `checkAccess`.
- Owner: use `Ownable` from OpenZeppelin to restrict grant/revoke.
```bash
pnpm add @openzeppelin/contracts
```

#### D3. Tests and deployment
1) Unit tests validating grant/check/revoke.
2) Network config for Chiliz Spicy (fill RPC/chainId from docs) in `hardhat.config.ts`.
3) `scripts/deploy.ts` outputs address and writes ABI to `apps/api/src/contracts/`.
4) Deploy:
```bash
npx hardhat run scripts/deploy.ts --network chilizSpicy
```
5) Copy address/ABI to frontend if needed for reads (not strictly required for MVP since reads happen server‑side).

---

### Part E — Flow minimal module (contracts/flow + web)

#### E1. Cadence contract
1) Create `contracts/flow/ScoutCredential.cdc` using standard NFT template.
2) Use Flow CLI to deploy to Testnet; record contract address.

#### E2. Frontend mint button
1) In `profile/page.tsx`, add a "Mint Scout Credential" button using FCL:
- If going direct: send a transaction referencing `SCOUT_CREDENTIAL_ADDRESS`.
- Or call a tiny backend helper endpoint that triggers a server‑side Cadence transaction (optional).
2) Display tx id and link to Flow testnet explorer.

#### E3. Env for Flow
Add to `apps/web/.env.local.example` (already listed):
- `NEXT_PUBLIC_FLOW_ACCESS_NODE`
- `NEXT_PUBLIC_FLOW_WALLET_URL`
- `NEXT_PUBLIC_FLOW_CONTRACT_ADDRESS` (optional alias of `SCOUT_CREDENTIAL_ADDRESS`)

---

### Part F — Local development and end‑to‑end test

#### F1. Local run
```bash
# in one terminal
pnpm --filter api dev

# in another
pnpm --filter web dev
```
Open `http://localhost:3000`. Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`.

#### F2. Happy path walkthrough
1) Connect EVM wallet (Chiliz Spicy). If chain not added, the app prompts to add/switch.
2) Open a locked video → 402 returned → x402 modal launched.
3) Payment success → backend verifies → on‑chain grant → manifest pre‑signed URL returned → HLS plays.
4) Agent page: run programmatic purchase and fetch frames.
5) Profile: connect Flow and mint NFT.

#### F3. Error cases to test
- Wallet not connected.
- Wrong chain.
- 402 failed or cancelled payment.
- Webhook duplicate events.
- Expired pre‑signed URLs (player retries should succeed after revalidation).

---

### Part G — Deliverables checklist

- Frontend (Vercel): Next.js app with Gallery, VideoView (x402 flow), Upload, Profile (Flow mint), Agent demo.
- Backend: Express API with endpoints listed; S3 integration; x402 and mock modes; Chiliz signer.
- Contract: `VideoAccessControl.sol` deployed on Chiliz Spicy; address documented.
- Flow: `ScoutCredential.cdc` deployed on Flow Testnet; address in README and UI mint working.
- CI: GitHub Actions running lint, typecheck, build (and optional preview deploy).

---

### Appendix — Monorepo layout
```
apps/
  web/
  api/
contracts/
  chiliz/
  flow/
infra/
  ffmpeg/
```

### Appendix — Secrets management
- Vercel (web): set `NEXT_PUBLIC_*` envs for RPC, API URL, Flow config.
- GitHub Actions: add `VERCEL_*` tokens if using the deploy job.
- Backend envs remain in your server host (not Vercel unless you also deploy api there via serverless, which is not required for MVP).


