# WhatsApp Merchant Pulse — Detailed Implementation Spec

**Date:** 2026-03-24
**Status:** Ready for review before implementation

---

## What We Are Building

A Node.js script (`whatsapp/listener.ts`) that connects to WhatsApp Web using the Baileys library, pulls the last 24 hours of group messages from 1000+ merchant groups, and writes the data to a local JSON file. A Claude scheduled task then analyzes this data and generates a "Merchant Pulse" tab on the daily dashboard.

---

## Exactly What Gets Built (File by File)

### 1. `whatsapp/listener.ts` — The WhatsApp Connection Script

**What it does:**
- Connects to WhatsApp Web servers via WebSocket using saved credentials
- Calls `sock.groupFetchAllParticipating()` to get a list of all groups
- For each group, collects messages received in the last 24 hours via the `messages.upsert` event during initial history sync
- Writes all messages to `data/whatsapp-raw.json` (raw dump)
- Disconnects after sync is complete

**Exact Baileys API calls used:**

```typescript
import makeWASocket, {
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  Browsers
} from 'baileys'

// 1. Load saved credentials
const { state, saveCreds } = await useMultiFileAuthState('./auth_info')

// 2. Create socket
const sock = makeWASocket({
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, logger),
  },
  browser: Browsers.macOS('Desktop'),  // Emulate desktop for full history
  syncFullHistory: true,               // Request full message history
  markOnlineOnConnect: false,          // Don't show "online" status
})

// 3. Handle QR code (first time only)
sock.ev.on('connection.update', ({ connection, qr, lastDisconnect }) => {
  if (qr) { /* print QR to terminal for scanning */ }
  if (connection === 'close') { /* handle disconnect/reconnect */ }
  if (connection === 'open') { /* connected successfully */ }
})

// 4. Save credentials on every update (CRITICAL)
sock.ev.on('creds.update', saveCreds)

// 5. Collect messages during history sync
sock.ev.on('messages.upsert', ({ messages, type }) => {
  // type === 'notify' for new real-time messages
  // type === 'append' for history sync messages
  for (const msg of messages) {
    // msg.key.remoteJid ends with @g.us = group message
    // msg.pushName = sender's display name
    // msg.messageTimestamp = unix timestamp
    // msg.message?.conversation or msg.message?.extendedTextMessage?.text = text content
  }
})

// 6. Fetch all groups
const groups = await sock.groupFetchAllParticipating()
// Returns: Record<string, GroupMetadata>
// GroupMetadata has: id, subject (name), desc, participants[], creation timestamp

// 7. Disconnect when done
sock.end()
```

**Output:** `data/whatsapp-raw.json`
```json
{
  "pulledAt": "2026-03-24T06:55:00+05:30",
  "groups": [
    {
      "id": "120363012345@g.us",
      "name": "GoKwik x Puma Official",
      "participantCount": 12,
      "messages": [
        {
          "id": "ABCDEF123",
          "sender": "Rajesh Kumar",
          "senderJid": "919876543210@s.whatsapp.net",
          "text": "The campaign delivery is delayed again...",
          "timestamp": "2026-03-23T14:30:00+05:30",
          "isFromMe": false,
          "hasMedia": false
        }
      ]
    }
  ],
  "stats": {
    "totalGroups": 1024,
    "groupsWithMessages": 450,
    "totalMessages": 48000,
    "pullDurationMs": 300000
  }
}
```

### 2. `whatsapp/auth-setup.ts` — One-Time QR Authentication

**What it does:**
- Run ONCE to scan the QR code and establish credentials
- Prints QR code to terminal (uses `qrcode-terminal` npm package)
- Waits for successful connection, then exits
- Credentials saved to `auth_info/` directory

```
$ npx tsx whatsapp/auth-setup.ts
Scan this QR code with WhatsApp on your phone:
[QR CODE APPEARS]
✅ Connected! Credentials saved to auth_info/
Found 1,024 groups. You're all set.
```

### 3. `whatsapp/analyzer.ts` — Message Analysis Pipeline

**What it does:**
- Reads `data/whatsapp-raw.json`
- Reads `data/merchant-mapping.json` for group-to-merchant mapping
- Runs in two passes:

**Pass 1: Keyword Scan (ALL groups, instant)**
- Scans every message for red-flag and positive keywords
- Groups with 3+ red flags get marked as "alert"
- Groups with positive keywords get marked as "win"

**Pass 2: AI Deep Read (today's batch only, ~143 groups)**
- Determines today's batch (Mon=A, Tue=B, etc.)
- For each group in today's batch, feeds the full day's messages to Claude
- Claude generates: health score, issue summary (if any), sentiment
- Results merged into the weekly health scorecard

**Output:** `data/whatsapp-data.json` (the file the dashboard reads)

### 4. `whatsapp/config.ts` — Configuration

```typescript
export const RED_FLAG_KEYWORDS = {
  complaints: ['issue', 'problem', 'not working', 'wrong', 'broken', 'bug', 'error',
    'fail', 'stuck', 'delayed', 'missing', 'lost'],
  churn: ['cancel', 'shifting', 'competitor', 'limechat', 'gupshup', 'interakt',
    'moving to', 'switch to', 'better option', 'alternative'],
  billing: ['overcharged', 'billing issue', 'invoice wrong', 'credit note',
    'extra charge', 'wrong amount', 'payment issue'],
  escalation: ['urgent', 'escalate', 'management', 'unacceptable', 'not acceptable',
    'higher authority', 'legal'],
}

export const POSITIVE_KEYWORDS = [
  'great', 'working well', 'impressed', 'thank you', 'love it', 'excellent',
  'happy', 'smooth', 'perfect', 'amazing', 'fantastic', 'appreciate'
]

export const BATCH_CONFIG = {
  batchSize: 143,  // 1000 / 7
  schedule: {
    0: 'G', // Sunday
    1: 'A', // Monday
    2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F'
  }
}

// Messages to IGNORE (system messages, join/leave, etc.)
export const IGNORE_PATTERNS = [
  /joined using this group/i,
  /left$/i,
  /changed the subject/i,
  /changed this group/i,
  /added \+/i,
  /removed \+/i,
  /Messages and calls are end-to-end encrypted/i,
]
```

### 5. `data/merchant-mapping.json` — Group-to-Merchant Map

**Generated on first run, manually reviewed by Vijay.**

```json
{
  "version": 1,
  "lastUpdated": "2026-03-24",
  "groups": [
    {
      "groupId": "120363012345@g.us",
      "groupName": "GoKwik x Puma Official",
      "merchant": "Puma",
      "category": "enterprise",
      "batch": "A",
      "ignore": false
    },
    {
      "groupId": "120363099999@g.us",
      "groupName": "GoKwik Internal - Random",
      "merchant": null,
      "category": "internal",
      "batch": null,
      "ignore": true
    }
  ],
  "unmapped": [
    {
      "groupId": "120363055555@g.us",
      "groupName": "Some Random Group 123",
      "participantCount": 5,
      "needsReview": true
    }
  ]
}
```

### 6. Dashboard Components

**`app/whatsapp/page.tsx`** — New tab showing:
- WhatsAppAlerts.tsx (red-flag groups)
- MerchantHealthBoard.tsx (color-coded health scores for all merchants)
- TrendingDown.tsx (merchants getting worse)
- WhatsAppWins.tsx (positive signals)
- UnmatchedGroups.tsx (groups needing merchant name mapping)

**Navigation:** Add a tab bar to the main layout toggling between "/" (main dashboard) and "/whatsapp" (merchant pulse).

---

## How the Daily Flow Works

```
6:50 AM  Scheduled task starts
         ├─ Step 1: Run `npx tsx whatsapp/listener.ts`
         │          Baileys connects → syncs history → writes whatsapp-raw.json
         │          Duration: 5-10 minutes
         │          (If auth fails, skip WhatsApp, continue with Gmail/Jira/Slack)
         │
         ├─ Step 2: Run analysis (keyword scan + batch deep read)
         │          Reads whatsapp-raw.json → writes whatsapp-data.json
         │
         ├─ Step 3: Pull Gmail, Jira, Slack (existing flow)
         │          Writes dashboard-data.json
         │
         └─ Step 4: git push → Vercel deploys both tabs

7:00 AM  Dashboard ready at daily-dashboard-tan.vercel.app
```

---

## Where It WILL Break (Failure Modes)

### CRITICAL FAILURES (will stop the system)

**1. Account Ban (Probability: HIGH over months)**
- **What happens:** WhatsApp bans the phone number. Baileys gets a `DisconnectReason.loggedOut` error. The `auth_info/` credentials become invalid. The listener script crashes with "Connection closed. You are logged out."
- **Symptoms:** Script fails immediately on connection. No QR code offered (banned numbers can't re-link).
- **Impact:** Zero WhatsApp data until a new number is set up.
- **Mitigation:**
  - Use a dedicated burner number (not Vijay's primary)
  - Read-only mode only (never send messages)
  - Short session windows (~10 min/day) instead of 24/7
  - Keep a backup SIM ready. When banned, swap number, re-scan QR, re-add to groups.
- **Detection:** Listener script exits with code 1 + log message "loggedOut". Dashboard shows "WhatsApp: disconnected" badge.
- **Recovery time:** Hours to days (depends on how fast the new number gets added to 1000+ groups — this is the real pain point).

**2. Session/Credential Corruption (Probability: MEDIUM)**
- **What happens:** The `auth_info/` directory gets corrupted (incomplete write during save, disk full, interrupted process). Baileys can't decrypt messages or handshake fails.
- **Symptoms:** "Bad MAC" errors, "Unable to decrypt message" errors, connection drops immediately after connecting.
- **Impact:** Can't connect until credentials are re-established.
- **Mitigation:**
  - `saveCreds` must be called on EVERY `creds.update` event — if even one is missed, session breaks on next restart
  - Back up `auth_info/` daily to a separate location
  - Never interrupt the listener script mid-run (no Ctrl+C during first 30 seconds)
- **Detection:** Connection fails with crypto errors in logs.
- **Recovery:** Delete `auth_info/`, re-scan QR code. Takes 2 minutes.

**3. WhatsApp Protocol Change (Probability: LOW per month, CERTAIN over a year)**
- **What happens:** Meta updates the WhatsApp Web protocol. Baileys v7.x can no longer connect. The WebSocket handshake fails or messages can't be decrypted.
- **Symptoms:** Connection timeout, "unsupported version" errors, or silent failures where connection opens but no messages arrive.
- **Impact:** Complete outage until Baileys releases a patch.
- **Mitigation:**
  - Pin Baileys version in package.json (don't auto-update)
  - Monitor [Baileys GitHub issues](https://github.com/WhiskeySockets/Baileys/issues) for protocol break reports
  - Be ready to update Baileys version when patches drop (usually within days of a protocol change)
- **Detection:** Listener connects but `messages.upsert` events stop firing. Or connection refuses entirely.
- **Recovery time:** Days to weeks (depends on Baileys maintainers).

### MODERATE FAILURES (degraded but still works)

**4. LID vs JID Format Issue (Probability: HIGH — active issue in 2025)**
- **What happens:** WhatsApp is migrating from JID (`919876543210@s.whatsapp.net`) to LID (`12345678:90@lid`) format for sender identification. Baileys intermittently receives messages with LID format that can't be resolved to phone numbers or names.
- **Symptoms:** Some messages show sender as a cryptic LID string instead of a name. `pushName` may be null. Group metadata may not match.
- **Impact:** Some messages can't be attributed to specific people. Analysis quality degrades for affected messages.
- **Mitigation:**
  - Use `pushName` (display name) as primary identifier, not phone number
  - Fall back to "Unknown sender" when both JID and pushName are unavailable
  - This is a known Baileys issue with active fixes — update when patched
- **Detection:** Messages in whatsapp-raw.json with null sender names.

**5. History Sync Incomplete (Probability: MEDIUM)**
- **What happens:** Baileys' `syncFullHistory` doesn't guarantee ALL messages. WhatsApp's history sync is designed for linked devices and may deliver messages out of order, skip some, or take a long time for 1000+ groups.
- **Symptoms:** Some groups show 0 messages even though they were active. Message counts seem lower than expected. Messages from >24h ago appear while recent ones are missing.
- **Impact:** Incomplete picture for some merchants. False "no activity" readings.
- **Mitigation:**
  - Don't rely on history sync alone. Also listen for real-time `messages.upsert` events during the connection window.
  - Keep the connection open for 5-10 minutes to allow sync to complete.
  - Track "groups with 0 messages" — if a group consistently shows 0 but Vijay knows it's active, flag it.
  - Use `fetchMessageHistory(50, oldestMessage.key, oldestMessage.timestamp)` for on-demand deeper history per group.
- **Detection:** Compare group count with messages vs group count without. If >20% of groups have 0 messages, something is wrong.

**6. Rate Limiting / Throttling (Probability: MEDIUM)**
- **What happens:** WhatsApp throttles the connection when too many API calls happen too fast. `groupFetchAllParticipating()` for 1000+ groups may trigger throttling.
- **Symptoms:** Timeout errors on group metadata fetches. Some groups return empty metadata. Connection becomes sluggish.
- **Impact:** Incomplete group list or missing metadata for some groups.
- **Mitigation:**
  - Add delays between batch operations (e.g., fetch group metadata in batches of 50 with 2-second pauses)
  - Cache group metadata locally — only re-fetch weekly, not daily
  - `groupFetchAllParticipating()` returns all groups in one call which is better than fetching individually
- **Detection:** Timeout errors in logs. Group count is significantly lower than expected.

**7. Message Decryption Failures (Probability: LOW-MEDIUM)**
- **What happens:** Signal protocol key mismatch. Some messages can't be decrypted, especially in groups where participants change frequently.
- **Symptoms:** `getMessage` callback is called but returns null. Message shows as "[Unable to decrypt]" or is simply missing from the upsert event.
- **Impact:** Individual messages lost. Usually not systematic — affects a few messages per day.
- **Mitigation:**
  - Implement the `getMessage` callback properly to support retries
  - Use `makeCacheableSignalKeyStore` (reduces key lookup failures by 80%)
  - Accept that 100% message capture is not achievable with Baileys
- **Detection:** Count "decrypt failure" log entries. If >5% of messages fail, investigate.

### MINOR FAILURES (nuisances)

**8. Media Messages (Images, Videos, PDFs)**
- **What happens:** Merchants share screenshots, invoices, product images in groups. Baileys can download these but it's slow and adds complexity.
- **Decision:** V1 ignores media entirely. Only text messages are analyzed. Media messages logged as "[image]", "[video]", "[document: filename.pdf]".
- **Impact:** Misses context from screenshots showing errors, but text messages usually describe the issue too.

**9. Non-English Messages**
- **What happens:** Some merchant groups use Hindi, regional languages, or mixed Hindi-English (Hinglish).
- **Impact:** Keyword scan misses Hindi complaints. AI deep read can handle multilingual but keywords are English-only.
- **Mitigation (V2):** Add Hindi red-flag keywords: "dikkat", "problem ho raha", "kaam nahi kar raha", "galat", "paisa wapas"

**10. Group Name Changes**
- **What happens:** Someone renames a group. The `merchant-mapping.json` mapping uses groupId (stable) not group name, so mapping survives. But the dashboard might show the old name until the next metadata refresh.
- **Impact:** Cosmetic — wrong group name displayed for up to 7 days.

---

## What Vijay Needs to Do (Manual Steps)

1. **Get a dedicated SIM card** — a fresh number that can receive SMS for WhatsApp registration. Install WhatsApp (or WhatsApp Business) on it. This number will be the "listener."

2. **Add the listener number to all 1000+ groups** — This is the hardest part. Options:
   - Ask your ops team to add the number to all groups manually (days of work)
   - Add it to new groups going forward and gradually cover old ones
   - If using WhatsApp Business app, some bulk-add tools exist (but risky)

3. **Run QR scan once** — `npx tsx whatsapp/auth-setup.ts`, scan QR from the listener phone, done.

4. **Review merchant-mapping.json** — After first pull, Claude auto-maps group names to merchants. Vijay corrects wrong matches (~30 min of review).

5. **Keep the listener phone charged and connected to internet** — The phone must have WhatsApp installed and active (not necessarily open, but not uninstalled).

---

## Dependencies to Install

```bash
npm install baileys@7.0.0-rc.9   # WhatsApp Web client
npm install qrcode-terminal        # QR code display in terminal
npm install pino                    # Logger (required by Baileys)
npm install link-preview-js         # Optional, for link previews
```

Dev dependencies:
```bash
npm install -D tsx                  # Run TypeScript directly
```

---

## What's NOT in V1 (Deliberately Excluded)

- ❌ Sending messages (read-only only — reduces ban risk)
- ❌ Media download/analysis (text only — keeps it fast)
- ❌ Real-time alerts (daily batch only — reduces connection time)
- ❌ Individual chat monitoring (groups only)
- ❌ Hindi/regional language keyword scan (English only in V1)
- ❌ Automated group joining (manual add required)
- ❌ Multi-number load balancing (single number in V1)

---

## Success Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Connection success rate | >95% of daily runs | Check listener logs |
| Groups captured | >90% of all groups | Compare with WhatsApp app group count |
| Message capture rate | >85% of text messages | Spot-check 10 groups manually |
| Keyword scan accuracy | <5% false negatives | Vijay reviews alerts for 1 week |
| Merchant mapping | >80% auto-matched | Review unmapped groups count |
| Pull duration | <10 minutes | Check stats in whatsapp-raw.json |
| Account survival | >30 days per number | Track ban events |

---

## Estimated Build Time

| Phase | What | Time |
|-------|------|------|
| Phase 1 | Install Baileys, auth script, listener script | 2-3 hours |
| Phase 2 | Analyzer (keyword scan + batch config) | 1-2 hours |
| Phase 3 | Dashboard UI (5 components + /whatsapp page) | 2-3 hours |
| Phase 4 | First real pull + merchant mapping review | 1 hour + Vijay's review time |
| Phase 5 | Integrate into scheduled task | 1 hour |
| **Total** | **Everything running end-to-end** | **~8-10 hours of Claude time** |

The blocker is NOT the code — it's getting the dedicated SIM + adding it to 1000+ groups.
