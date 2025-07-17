// analyticplan.entity.ts
export interface AnalyticPlan {
  /** text, NOT NULL */
  id: string;
  /** integer, NOT NULL */
  maxDepth: number;
  /** uuid, NOT NULL */
  uniqueId: string;
  /** boolean, NOT NULL */
  isActive: boolean;
  /** integer, NULLABLE */
  sysEditCounter?: number;
  /** integer, NULLABLE */
  sysRecordVersion?: number;
  /** uuid, NULLABLE */
  sysRecordVersionId?: string;
  /** integer, NULLABLE */
  waitingPlanItemId?: number;
  /** text, NULLABLE */
  label?: string;
  /** timestamp, NULLABLE */
  sysCreatedDate?: Date;
  /** text, NULLABLE */
  sysCreatedUser?: string;
  /** timestamp, NULLABLE */
  sysModifiedDate?: Date;
  /** text, NULLABLE */
  sysModifiedUser?: string;
  /** text, NULLABLE */
  notesClear?: string;
  /** text, NULLABLE */
  notes?: string;
} 