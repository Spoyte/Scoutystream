## ScoutyStream v2 — Streaming + On‑chain Access (Chiliz) + x402 (Coinbase) + Minimal Flow

### 1) Goals (what we actually ship for the hackathon)
- **Core**: Paywalled streaming of sports training sessions that scouts access via HTTP 402/x402; successful payment grants on‑chain access on Chiliz.
- **AI‑friendly**: First‑class programmatic flow so AI agents can pay, fetch streams, and retrieve analysis‑friendly assets (HLS manifests, frames, captions, metadata).
- **Flow (minimal)**: A separate, 10‑minute module to mint a “Scout Credential” NFT on Flow Testnet from the app’s Profile page.

Non‑goals for MVP: token economics, social graphs, complex DRM, multi‑chain access tokens, production‑grade abuse prevention. Keep it demoable and robust enough to judge.

### 2) Architecture (high‑level)

```
Web App (Next.js/React) ─┬─> Backend API (Node/Express)
                         │     ├─ x402 gateway (402 challenge + receipt verification)
                         │     ├─ Chiliz signer (grant on‑chain access)
                         │     ├─ Storage adaptor (S3 pre‑signed URLs for HLS)
                         │     └─ Agent API (programmatic endpoints)
                         └─> Flow Module (FCL) → Flow Testnet (ScoutCredential NFT)

Chiliz Spicy Testnet ←(ethers/viem)→ VideoAccessControl.sol (check/grant access)
```

Key decisions
- **Access source of truth** on Chiliz: simple mapping per `videoId` and `user` address.
- **Gating** via short‑lived, pre‑signed HLS URLs after access check. This is simple, fast, and good enough for demo.
- **Payments** via Coinbase x402; fallback to a mocked payment path if x402 is unavailable.

### 3) Smart contracts (Chiliz)

- `VideoAccessControl.sol` (Chiliz Spicy Testnet)
  - Storage: `mapping(uint256 => mapping(address => bool)) public hasAccess;`
  - Functions:
    - `function grantAccess(address user, uint256 videoId) external onlyOwner`
    - `function grantAccessBatch(address[] calldata users, uint256 videoId) external onlyOwner`
    - `function revokeAccess(address user, uint256 videoId) external onlyOwner` (optional)
    - `function checkAccess(address user, uint256 videoId) external view returns (bool)`
  - Events:
    - `AccessGranted(address indexed user, uint256 indexed videoId)`
    - `AccessRevoked(address indexed user, uint256 indexed videoId)` (optional)
  - Notes: Keep pricing off‑chain to iterate quickly; chain is the authorization source.

### 4) Streaming and storage

- Store uploaded videos in S3 (or compatible, e.g., R2). Pre‑transcode to HLS (ffmpeg or AWS MediaConvert) during upload to avoid lag at view time.
- Backend issues short‑lived pre‑signed URLs for the HLS manifest and segments only after on‑chain access check passes.
- TTL 120–300s; the player will refresh the manifest as needed. Good enough for demo and prevents hotlinking.

### 5) Payments (HTTP 402/x402 first; simple fallback)

- Primary flow (human UI and agents):
  1) Client requests `GET /api/videos/:id/manifest`.
  2) If no access, server responds `402 Payment Required` with x402 challenge headers per Coinbase docs.
  3) Client satisfies the challenge using Coinbase’s x402 SDK/flow and returns/retries with the payment receipt/proof.
  4) Server verifies receipt (CDP verify or webhook), then calls `grantAccess` on Chiliz and responds with the pre‑signed HLS URL.

- Fallback (if x402 unavailable during hackathon):
  - `POST /api/videos/:id/purchase` (dev mode). Server “accepts” payment, grants access on chain, and returns the pre‑signed URL. Toggle with `PAYMENT_PROVIDER=mock`.

### 6) Backend API (Express)

- Public metadata
  - `GET /api/videos` → list with `id`, `title`, `thumbnail`, `price`, `duration`, `tags`.
  - `GET /api/videos/:id` → metadata + whether the connected wallet has access (via `checkAccess`).

- Pay/stream flow
  - `GET /api/videos/:id/manifest` → returns 200 with pre‑signed HLS manifest if has access; else 402 with x402 challenge.
  - `POST /api/payments/x402/verify` → receives receipt/proof, verifies with Coinbase, grants on chain, returns 200.
  - `POST /api/payments/webhook` → Coinbase webhook; on confirmed payment, grants on chain (idempotent).

- Upload (clubs)
  - `POST /api/uploads/request` → returns S3 pre‑signed PUT URL + `videoId`.
  - `POST /api/uploads/commit` → triggers ffmpeg job to HLS, stores metadata.

- Agent‑friendly helpers
  - `GET /api/videos/:id/frames?fps=1` → returns a zip or stream of JPEG frames (server‑side ffmpeg), gated by access.
  - `GET /api/videos/:id/captions` → WebVTT/SRT if provided.
  - `GET /api/videos/:id/manifest` (same endpoint, works for agents with 402 handling).

Auth model
- Human users connect EVM wallet (e.g., MetaMask on Chiliz Spicy). Address is the identity used on chain.
- Agents can also provide an EVM address and sign a short‑lived nonce via `POST /api/auth/siwe` (simple SIWE‑style), so the server knows which address to check/grant for.

### 7) Frontend (Next.js/React)

- Pages
  - `Gallery`: list of videos; clicking opens `VideoView`.
  - `VideoView`: attempts `GET /api/videos/:id/manifest` → handles 402 challenge → plays HLS.
  - `Club Upload`: request pre‑signed URL, upload, commit.
  - `Profile`: Flow wallet connect + “Mint Scout Credential” button.

- Wallets
  - EVM: MetaMask (custom RPC for Chiliz Spicy). Minimal connect + show address.
  - Flow: FCL for Testnet. One button mint.

### 8) Flow module (minimal, prize‑qualifying)

- Contract `ScoutCredential.cdc` on Flow Testnet: a tiny NFT (one per wallet or unlimited mints).
- UI: Connect Flow wallet and mint. Display token id/tx link.
- Isolated from the core logic; no coupling to Chiliz or payments.

### 9) Implementation plan (6 focused phases)

1) Repo and env (1–2h)
   - Monorepo layout (see below), env vars, RPCs, keys, faucets.

2) Chiliz contract (2–3h)
   - Implement, unit‑test locally, deploy to Spicy, capture address/ABI.

3) Backend core (3–4h)
   - Wallet auth (SIWE‑style), `checkAccess`, `grantAccess`, S3 pre‑sign, HLS serving.

4) x402 path + fallback (2–4h)
   - 402 challenge response, receipt verification handler, Coinbase webhook. Env toggle for `mock` provider.

5) Frontend (3–5h)
   - Gallery, VideoView (HLS + 402 flow), Upload flow, minimal polish.

6) Flow module (0.5–1.5h)
   - Cadence NFT, deploy, FCL mint UI.

### 10) Repo layout

```
apps/
  web/             # Next.js app (UI + Flow module)
  api/             # Express server
contracts/
  chiliz/          # VideoAccessControl.sol + scripts
  flow/            # ScoutCredential.cdc
infra/
  ffmpeg/          # scripts for HLS transcode (optional)
``` 

### 11) Key environment variables

```
CHILIZ_RPC_URL=
CHILIZ_CHAIN_ID=
CHILIZ_DEPLOYER_PRIVATE_KEY=
CHILIZ_VIDEO_ACCESS_CONTROL_ADDRESS=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=

PAYMENT_PROVIDER=x402|mock
COINBASE_X402_API_KEY=
COINBASE_WEBHOOK_SECRET=
COINBASE_ENV=test

FLOW_ACCESS_NODE=
FLOW_WALLET_URL=
FLOW_ACCOUNT_ADDRESS=
FLOW_ACCOUNT_PRIVATE_KEY=
SCOUT_CREDENTIAL_ADDRESS=
```

### 12) Demo script (what judges will see)

1) Connect EVM wallet (Chiliz Spicy) in the web app.
2) Open a locked video. Request fails with 402 → pay via x402 modal.
3) Payment confirmed → on‑chain `AccessGranted` event → video plays (HLS).
4) Switch to “Agent mode” in UI: trigger a programmatic call that handles 402, downloads a 1 FPS frames zip, and prints the first 3 detected actions (mocked or simple CV snippet).
5) Go to Profile → connect Flow wallet → mint Scout Credential NFT.

### 13) Security, abuse, and DX notes (MVP‑appropriate)

- Keep pre‑signed URLs short‑lived; regenerate on manifest refresh.
- Idempotent `grantAccess` on repeated payment webhooks/receipts.
- Log every access decision with request id and address for demo transparency.
- Rate‑limit frames/captions endpoints to deter scraping.
- Clear separation of concerns so agents can integrate with just HTTP.

### 14) Prize alignment checklist

- **Chiliz**
  - [ ] Contract deployed on Spicy Testnet (`VideoAccessControl.sol`).
  - [ ] Access rights enforced via on‑chain check in the API.
  - [ ] README calls out Chiliz as the core execution layer.

- **Coinbase (x402)**
  - [ ] 402 challenge/receipt flow integrated end‑to‑end.
  - [ ] Webhook verification path and idempotent grant.
  - [ ] Brief notes in README with developer feedback.

- **Flow**
  - [ ] `ScoutCredential.cdc` deployed to Flow Testnet.
  - [ ] UI button mints NFT via FCL.
  - [ ] README includes contract address and screenshots.

### 15) Stretch ideas (only if time permits)

- ERC‑1155 “Viewing Pass” on Chiliz per video/collection for tradability.
- Basic computer‑vision pipeline (pose/ball tracking) to auto‑tag clips.
- Clubs can airdrop limited preview passes (time‑bounded access) via signed off‑chain coupons redeemable by backend → on‑chain grant.

### 16) Quick API examples

Request manifest (human or agent):
```http
GET /api/videos/42/manifest HTTP/1.1
Accept: application/x-mpegURL
```

Possible 402 response (headers elided):
```http
HTTP/1.1 402 Payment Required
Content-Type: application/json
{ "error": "payment_required", "provider": "x402" }
```

Verify receipt then grant access:
```http
POST /api/payments/x402/verify HTTP/1.1
Content-Type: application/json
{ "videoId": 42, "receipt": "..." }
```

On success, retry manifest and receive a pre‑signed URL for the HLS playlist.

---

This plan optimizes for a fast, credible demo: Chiliz as the on‑chain authorization backbone, Coinbase x402 for pay‑per‑view economics (with a simple fallback), minimal Flow to qualify for prizes, and explicit agent‑friendly HTTP surfaces.


