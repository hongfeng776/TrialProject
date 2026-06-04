export type HealthLevel = 'high-risk' | 'medium-risk' | 'healthy';

export interface Customer {
  id: string;
  name: string;
  company: string;
  avatar: string;
  healthScore: number;
  healthLevel: HealthLevel;
  lastContact: string;
  contractValue: number;
  renewalDate: string;
  industry: string;
}

export interface HealthDimension {
  key: string;
  name: string;
  score: number;
  weight: number;
  icon: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ScoreTrend {
  date: string;
  score: number;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  customerId: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  priority: TaskPriority;
  createdAt: string;
}

export type ReachType = 'call' | 'email' | 'meeting' | 'wechat';

export interface ReachRecord {
  id: string;
  customerId: string;
  type: ReachType;
  content: string;
  operator: string;
  createdAt: string;
  nextStep?: string;
}

export type RiskSeverity = 'critical' | 'warning' | 'info';

export interface RiskRule {
  id: string;
  name: string;
  description: string;
  severity: RiskSeverity;
  triggered: boolean;
  suggestion: string;
}

export interface CustomerDetail {
  customer: Customer;
  healthDimensions: HealthDimension[];
  scoreTrend: ScoreTrend[];
  tasks: Task[];
  reachRecords: ReachRecord[];
  riskRules: RiskRule[];
}
