# WhatsApp Merchant Pulse — Design Document

**Date:** 2026-03-24
**Author:** Vijay Sandilya + Claude
**Status:** Draft — pending implementation

## Problem

Vijay is a member of 1000+ WhatsApp merchant groups (GoKwik/KwikEngage/KwikShip). Issues surface in these groups but often go unnoticed until they escalate to email/Slack/Jira. There is no automated way to monitor these groups for problems or positive signals.

## Solution

Add a "Merchant Pulse" tab to the daily dashboard that surfaces issues, health scores, and trends from WhatsApp merchant groups. Data pulled daily using Baileys (WhiskeySockets) library.

## Architecture

### Layer 1: WhatsApp Listener (Baileys)

- **Library:** WhiskeySockets/Baileys v7.x (TypeScript, Node.js)
- **Connection pattern:** Daily snapshot, NOT always-on
  - Connects at ~6:50am IST using saved credentials
  - Pulls last 24h of messages from all groups
  - Disconnects after ~5-10 minutes
  - Total daily connection: under 10 minutes
- **Authentication:** One-time QR scan, credentials persisted in `auth_info/` (gitignored)
- **Risk mitigation:**
  - Dedicated phone number (not primary business number)
  - Read-only — NEVER sends messages
  - Short daily connection windows (human-like pattern)
  - Expect occasional bans; architecture supports re-auth with new number

### Layer 2: Analysis (Claude)

**Daily analysis uses a 7-day rotating batch system:**

| Day | Groups Analyzed (Deep Read) | All Groups |
|-----|----------------------------|------------|
| Mon | Batch A (1-143) | Keyword scan |
| Tue | Batch B (144-286) | Keyword scan |
| Wed | Batch C (287-429) | Keyword scan |
| Thu | Batch D (430-572) | Keyword scan |
| Fri | Batch E (573-715) | Keyword scan |
| Sat | Batch F (716-858) | Keyword scan |
| Sun | Batch G (859-1000+) | Keyword scan |

**Every group gets:**
- Daily keyword red-flag scan (instant, all groups)
- Weekly full Claude deep-read (rotating batch)

**Red-flag keywords (customizable in config):**
- Complaints: "issue", "problem", "not working", "wrong", "broken", "bug"
- Churn signals: "cancel", "shifting", "competitor", "limechat", "gupshup", "interakt"
- Billing: "overcharged", "billing issue", "invoice wrong", "credit note"
- Escalation: "urgent", "escalate", "management", "unacceptable"
- Positive: "great", "working well", "impressed", "thank you", "love it"

**Health scoring (per merchant):**
- 🟢 Happy: Positive interactions, quick resolutions, merchant engaged
- 🟡 Neutral: Normal operational messages, no strong signals
- 🟠 At-Risk: Complaints surfacing, slow responses, declining engagement
- 🔴 Churning: Active complaints, competitor mentions, disengagement

### Layer 3: Dashboard (Vercel)

New tab at `/whatsapp` on existing daily-dashboard-tan.vercel.app.

**Sections:**
1. **Alerts** — Groups with red-flag keywords or AI-detected issues in last 24h
2. **Merchant Health Board** — All merchants with color-coded health scores
3. **Trending Down** — Merchants whose score dropped week-over-week
4. **Wins** — Groups with positive signals (praise, satisfaction, growth)
5. **Unmatched Groups** — New groups needing merchant name mapping

## Data Model

### merchant-mapping.json
```json
{
  "groups": [
    {
      "groupId": "120363012345@g.us",
      "groupName": "GoKwik x Puma Official",
      "merchant": "Puma",
      "merchantId": "puma-india",
      "category": "enterprise",
      "batch": "A",
      "confidence": "high"
    }
  ]
}
```

### whatsapp-data.json (generated daily)
```json
{
  "lastPulled": "ISO timestamp",
  "pullStats": {
    "groupsConnected": 1024,
    "messagesPulled": 48000,
    "redFlagsDetected": 15,
    "groupsDeepRead": 143,
    "batchToday": "A"
  },
  "alerts": [
    {
      "groupId": "...",
      "merchant": "Beyours",
      "severity": "high",
      "summary": "Founder Nilesh upset about sent-vs-delivered billing. Threatening to move to Limechat.",
      "messageCount": 8,
      "timestamp": "ISO"
    }
  ],
  "healthScores": [
    {
      "merchant": "Puma",
      "score": "happy",
      "lastUpdated": "ISO",
      "trend": "stable",
      "lastDeepRead": "ISO"
    }
  ],
  "wins": [...],
  "trendingDown": [...],
  "unmatchedGroups": [...]
}
```

## Project Structure (new files)

```
daily-dashboard/
├── whatsapp/
│   ├── listener.ts        # Baileys connection + message pull
│   ├── analyzer.ts        # Keyword scan + AI analysis
│   ├── types.ts           # WhatsApp-specific types
│   └── config.ts          # Keywords, batch config, thresholds
├── auth_info/             # Baileys session credentials (GITIGNORED)
├── data/
│   ├── whatsapp-data.json # Generated daily
│   └── merchant-mapping.json # Group-to-merchant mapping
├── app/
│   └── whatsapp/
│       └── page.tsx       # Merchant Pulse tab
├── components/
│   ├── WhatsAppAlerts.tsx
│   ├── MerchantHealthBoard.tsx
│   ├── TrendingDown.tsx
│   ├── WhatsAppWins.tsx
│   └── UnmatchedGroups.tsx
```

## Implementation Steps

### Phase 1: Baileys Setup + First Pull
1. Install Baileys: `npm install baileys`
2. Create `whatsapp/listener.ts` — connect, authenticate, pull messages
3. Run QR scan to authenticate
4. First pull: get all group names + metadata
5. Generate initial `merchant-mapping.json` (AI fuzzy matching)

### Phase 2: Analysis Pipeline
1. Create `whatsapp/analyzer.ts` — keyword scan + batch rotation
2. Create `whatsapp/config.ts` — keywords, batch assignments
3. Integrate into scheduled task: run listener → analyzer → write JSON

### Phase 3: Dashboard UI
1. Create `/whatsapp` page with tab navigation
2. Build 5 section components
3. Add navigation between main dashboard and WhatsApp tab

### Phase 4: Mapping Review
1. Vijay reviews merchant-mapping.json
2. Corrects wrong matches, fills unknowns
3. Dashboard shows unmatched groups for ongoing review

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Account ban | Dedicated number, read-only, short sessions |
| Session expiry | Auto-detect + notify Vijay to re-scan |
| WhatsApp protocol change | Pin Baileys version, monitor GitHub issues |
| Too many messages | Tiered analysis (keyword + rotating batch) |
| Group name mismatch | Auto-mapping + manual review + unmatched UI |

## Success Criteria

- [ ] Pull messages from 1000+ groups in under 10 minutes
- [ ] Detect merchant complaints within 24 hours of them appearing
- [ ] Health score accuracy validated by Vijay for top 50 merchants
- [ ] Zero impact on primary WhatsApp account (uses dedicated number)
- [ ] Dashboard loads in under 3 seconds with full WhatsApp data
