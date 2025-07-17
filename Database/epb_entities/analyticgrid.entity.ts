// analyticgrid.entity.ts
export interface AnalyticGrid {
  /** uuid, NOT NULL */
  uniqueId: string;
  /** text, NOT NULL */
  id: string;
  /** text, NULLABLE */
  label?: string;
  /** integer, NULLABLE */
  sysEditCounter?: number;
  /** integer, NULLABLE */
  sysRecordVersion?: number;
  /** uuid, NULLABLE */
  sysRecordVersionId?: string;
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