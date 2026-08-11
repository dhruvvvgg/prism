export interface ConsentPermissions {
  viewPortfolio: boolean;
  analysePortfolio: boolean;
  recommendProducts: boolean;
}

export interface ConsentObject {
  id?: string;
  consentMode: 'VIEW' | 'STORE';
  fetchType: 'ONETIME' | 'PERIODIC';
  consentFrequency: string;
  dataLife: string;
  permissionsApproved: ConsentPermissions;
  timestamp: string;
}

export interface GovernanceMetrics {
  boardIndependence: number; // e.g., 60 for 60%
  boardIndependenceCitation: string;
  regulatoryTrackRecordScore: number; // 0-100
  regulatoryTrackRecordDetails: string;
  regulatoryTrackRecordCitation: string;
  distributionConsistencyScore: number; // 0-100
  distributionConsistencyDetails: string;
  distributionConsistencyCitation: string;
  weights: {
    boardIndependence: number;
    regulatoryTrackRecord: number;
    distributionConsistency: number;
  };
}

export interface Instrument {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  riskLabel: string;
  taxTreatment: string;
  taxLabel: string;
  yieldPotential: string;
  minInvestment: string;
  liquidity: string;
  governanceScore: number;
  governanceMetrics: GovernanceMetrics;
  suitabilityInsights: {
    income: string;
    inflation: string;
    growth: string;
    citation: string;
  };
}

export interface PortfolioAsset {
  name: string;
  value: number;
  percentage: number;
  change24h: number;
  icon: string;
  count: number;
}

export interface HoldingDetail {
  instrument_name: string;
  category: string;
  value: number;
  units_or_quantity: string;
}

export interface RiskProfile {
  score: number; // 0 - 100
  category: 'Conservative' | 'Moderate' | 'Aggressive';
  horizon: string;
  lossTolerance: string;
  incomeStability: string;
  experience: string;
  rawPoints: number;
  answers: Record<string, number>;
}

export interface Persona {
  persona_name: string;
  persona_tagline: string;
  total_portfolio_value: number;
  total_change_24h: number;
  asset_allocation: PortfolioAsset[];
  holdings_detail: HoldingDetail[];
  risk_profile?: RiskProfile;
}

export type TabType = 'dashboard' | 'discover' | 'coach' | 'settings' | 'onboarding';

// Prism types
export interface TaskProfile {
  deadline: string; // absolute time/date string
  taskType: 'presentation' | 'essay' | 'report' | 'code' | 'meeting_prep' | 'general';
  effortLevel: 'low' | 'medium' | 'high';
  currentProgress: 'none' | 'partial' | 'almost_done';
  dependencies: 'solo' | 'group';
  toneSignals: {
    panicLevel: 'low' | 'medium' | 'high';
    stakesContext: string;
  };
  originalInput: string;
}

export interface MissionAssessment {
  completionProbability: number; // 0 to 100
  timeRemaining: string; // e.g., "5 hours 20 min"
  recommendedStrategy: 'FIGHT' | 'NEGOTIATE';
  reasoning: string;
  details: {
    estimatedOutputCount: string; // e.g., "10-12 slides", "4-5 pages"
    challenges: string[];
    actionItems: string[];
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // Date string
  end: string; // Date string
  classification: 'critical' | 'skippable' | 'deferrable' | 'prism_work';
  actionTaken?: 'keep' | 'cancel' | 'postpone' | 'added';
  originalEvent?: any;
}

export interface EmailDraft {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  associatedEventId?: string;
  type: 'apology' | 'extension_request';
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface BootstrapOutput {
  title: string;
  type: TaskProfile['taskType'];
  outline: {
    section: string;
    description: string;
    bullets: string[];
    expandMarker?: string; // "[EXPAND THIS]"
  }[];
  additionalInfo?: string;
  sources: { title: string; url: string }[];
}

export interface StuckChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface Debrief {
  id: string;
  taskTitle: string;
  date: string;
  success: boolean;
  whatHappened: string;
  rootCause: string;
  preventiveAction: {
    suggestion: string;
    actionButtonLabel: string;
    calendarEventToSchedule: {
      title: string;
      durationMinutes: number;
    };
  };
}

export interface AmbientDeadlines {
  id: string;
  title: string;
  dueTime: string;
  effortLevel: 'low' | 'medium' | 'high';
  timeUntil: string;
  workspaceCreated: boolean;
}

export interface CompletedSession {
  id: string;
  mode: 'crisis' | 'plan' | 'review';
  taskDescription: string;
  date: string;
  completionProbability: number;
  strategy: 'FIGHT' | 'DAMAGE CONTROL';
  outcome: 'Success' | 'Aborted';
  debriefData: Debrief;
}

export type AccentTheme = 'cobalt' | 'emerald' | 'gold' | 'onyx';

export interface SEBICircularInfo {
  code: string;
  title: string;
  category: string;
  summary: string;
  year: string;
  link: string;
}
