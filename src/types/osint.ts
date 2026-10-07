export type InvestigationType = 'username' | 'phishing' | 'comprehensive';

export type RiskLevel = 'LOW' | 'GUARDED' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ConfidenceTier = 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low';

export type ProfileStatus = 
  | 'Potential Match' 
  | 'Username Correlation' 
  | 'Insufficient Evidence' 
  | 'Cannot Verify Identity' 
  | 'Provider Unavailable'
  | 'No Match Found';

export interface AgentTaskExecution {
  id: string;
  agentName: string;
  agentRole: string;
  task: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  executionTimeMs: number;
  evidenceCount: number;
  reasoning: string;
  outputSummary?: string;
  timestamp: string;
}

export interface UsernameProfileFinding {
  id: string;
  platform: string;
  platformCategory: 'Code' | 'Social' | 'Forums' | 'Web' | 'Fediverse';
  username: string;
  profileUrl: string;
  profileStatus: ProfileStatus;
  confidenceScore: number; // 0 - 100
  confidenceTier: ConfidenceTier;
  evidence: string[];
  lastChecked: string;
  source: string;
  rawMetadata?: Record<string, any>;
  isRelevant?: boolean;
  isFalsePositive?: boolean;
}

export interface CorrelationNode {
  id: string;
  label: string;
  type: 'target' | 'platform' | 'website' | 'identifier' | 'repository';
  source: string;
  confidence: number;
  evidence: string;
  timestamp: string;
}

export interface CorrelationLink {
  source: string;
  target: string;
  relationship: string;
  strength: number; // 0 - 1
}

export interface CorrelationGraphData {
  nodes: CorrelationNode[];
  links: CorrelationLink[];
}

export interface PhishingRiskFactor {
  factor: string;
  category: string;
  scoreContribution: number; // e.g. +20, -5
  detail: string;
  severity: 'benign' | 'info' | 'warning' | 'danger' | 'critical';
}

export interface PhishingAnalysisResult {
  url: string;
  normalizedUrl: string;
  protocol: string;
  domain: string;
  subdomain: string;
  tld: string;
  port: string;
  path: string;
  hasHttps: boolean;
  isIpAddress: boolean;
  ipAddress?: string;
  isShortened: boolean;
  isLookalike: boolean;
  lookalikeTarget?: string;
  homographDetails?: string;
  excessiveSubdomains: boolean;
  subdomainCount: number;
  suspiciousKeywords: string[];
  urlObfuscation: {
    hasHexEncoding: boolean;
    hasAtSymbol: boolean;
    excessiveEntropy: boolean;
    entropyValue: number;
  };
  domainAgeInfo: {
    available: boolean;
    ageDays?: number;
    createdDate?: string;
    status: string;
  };
  whoisInfo: {
    available: boolean;
    registrar?: string;
    country?: string;
    status: string;
  };
  dnsInfo: {
    available: boolean;
    hasMx: boolean;
    ipResolutions: string[];
    status: string;
  };
  sslCertificate: {
    hasCert: boolean;
    issuer?: string;
    validDaysRemaining?: number;
    status: string;
  };
  threatIntel: {
    checked: boolean;
    knownMalicious: boolean;
    matches: string[];
    reputationScore: number;
    status: string;
  };
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  riskBreakdown: PhishingRiskFactor[];
  suspiciousIndicators: string[];
  benignIndicators: string[];
  recommendedActions: string[];
  analystSummary: string;
  confidenceScore: number;
  isDemoData: boolean;
}

export interface EvidenceItem {
  id: string;
  investigationId: string;
  source: string;
  type: 'profile' | 'url_syntax' | 'domain_intel' | 'threat_reputation' | 'correlation' | 'analyst_note';
  url?: string;
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
  hash: string; // SHA-256
  isRelevant: boolean;
  isFalsePositive: boolean;
  chainOfCustodyRecord: {
    collectorAgent: string;
    acquisitionMethod: string;
    verifiedIntegrity: boolean;
  };
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  agent: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export interface AIAnalystInterpretation {
  whatWasFound: string;
  whatItMeans: string;
  confidenceScore: number;
  riskLevel: RiskLevel;
  potentialFalsePositives: string[];
  recommendedNextSteps: string[];
  generatedAt: string;
  modelUsed: string;
}

export interface InvestigationReport {
  id: string;
  investigationId: string;
  generatedAt: string;
  author: string;
  organization: {
    club: string;
    institution: string;
  };
  executiveSummary: string;
  target: {
    type: InvestigationType;
    query: string;
    normalizedQuery: string;
    scope: string;
  };
  methodology: string;
  aiInvestigationPlan: string[];
  sourcesChecked: {
    source: string;
    status: 'Checked' | 'No Match' | 'Unavailable' | 'Correlated';
    details: string;
  }[];
  findings: string[];
  evidenceCount: number;
  riskAssessment: {
    score: number;
    level: RiskLevel;
    breakdownText: string;
  };
  confidence: {
    score: number;
    tier: ConfidenceTier;
    explanation: string;
  };
  falsePositiveConsiderations: string[];
  recommendations: string[];
  timeline: TimelineEvent[];
  legalNotice: string;
}

export interface Investigation {
  id: string;
  type: InvestigationType;
  target: string;
  normalizedTarget: string;
  scope: string;
  status: 'initializing' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  isDemoMode: boolean;
  riskScore: number;
  riskLevel: RiskLevel;
  confidenceScore: number;
  confidenceTier: ConfidenceTier;
  agents: AgentTaskExecution[];
  usernameFindings?: UsernameProfileFinding[];
  correlationGraph?: CorrelationGraphData;
  phishingAnalysis?: PhishingAnalysisResult;
  evidence: EvidenceItem[];
  timeline: TimelineEvent[];
  analystInterpretation?: AIAnalystInterpretation;
  report?: InvestigationReport;
}
