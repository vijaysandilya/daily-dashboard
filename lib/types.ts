export interface DashboardData {
  lastRefreshed: string;
  aiBriefing: AiBriefing;
  unrepliedEmails: UnrepliedEmail[];
  actionItems: ActionItem[];
  jiraTickets: JiraTicket[];
  slackAttention: SlackItem[];
}

export interface AiBriefing {
  summary: string;
  highlights: string[];
}

export interface UnrepliedEmail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  receivedAt: string;
  threadId: string;
  url: string;
}

export interface ActionItem {
  id: string;
  text: string;
  source: string;
  sourceType: "email" | "slack" | "jira";
  sourceUrl: string;
  date: string;
  done: boolean;
}

export interface JiraTicket {
  key: string;
  summary: string;
  status: string;
  priority: string;
  dueDate: string | null;
  url: string;
  type: string;
}

export interface SlackItem {
  id: string;
  type: "dm" | "mention" | "thread";
  from: string;
  channel: string;
  preview: string;
  timestamp: string;
  url: string;
}

export interface GoalsData {
  objectives: Objective[];
  notes: string[];
}

export interface Objective {
  title: string;
  keyResults: KeyResult[];
}

export interface KeyResult {
  title: string;
  target: string;
  current: string;
  unit: string;
}
