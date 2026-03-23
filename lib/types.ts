export interface DashboardData {
  lastRefreshed: string;
  aiBriefing: AiBriefing;
  unrepliedEmails: UnrepliedEmail[];
  actionItems: ActionItem[];
  followUps: FollowUp[];
  financeApprovals: FinanceApproval[];
  financeNeedsClarification: FinanceClarification[];
  jiraTickets: JiraTicket[];
  slackAttention: SlackItem[];
  pullStats: PullStats;
}

export interface FinanceApproval {
  key: string;
  summary: string;
  amount: string | null;
  requestedBy: string;
  whatToApprove: string;
  createdDate: string;
  daysPending: number;
  priority: string;
  url: string;
}

export interface FinanceClarification {
  key: string;
  summary: string;
  vijayQuestion: string;
  lastReply: string;
  url: string;
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

export interface FollowUp {
  id: string;
  text: string;
  to: string;
  source: string;
  sourceType: "email" | "slack" | "jira";
  sourceUrl: string;
  date: string;
  status: "pending" | "done";
}

export interface PullStats {
  gmailSearched: number;
  gmailUnreplied: number;
  gmailTranscriptsRead: number;
  jiraTicketsChecked: number;
  jiraCommentsRead: number;
  jiraActive: number;
  slackChannelsScanned: number;
  slackDmsChecked: number;
  slackMentionsFound: number;
  followUpsExtracted: number;
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
