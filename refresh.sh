#!/bin/bash
# One-click dashboard refresh
# Run: ./refresh.sh  OR  double-click in Finder

echo "🔄 Refreshing daily dashboard..."
echo "   This takes 3-5 minutes (reading Gmail, Jira, Slack)"
echo ""

claude -p "Run the daily-dashboard-refresh scheduled task now. Read the SKILL.md at ~/.claude/scheduled-tasks/daily-dashboard-refresh/SKILL.md and execute ALL steps: pull Gmail (deep thread analysis), Jira (with comment checking, last 30 days only), Slack (channel mentions + DMs), generate AI briefing, write dashboard-data.json, git commit and push." --allowedTools "mcp__61394f51-0176-40a3-9d83-96566a287d92__*,mcp__70cdecbb-e5c0-4f99-91fa-37164e257195__*,mcp__7d472007-1fe2-4a81-8b5e-66ed9359a8bd__*,Bash,Read,Write,Edit,Glob,Grep" 2>&1

echo ""
echo "✅ Dashboard refreshed! Check https://daily-dashboard-tan.vercel.app"
