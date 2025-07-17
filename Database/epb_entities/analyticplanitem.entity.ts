// analyticplanitem.entity.ts
export interface AnalyticPlanItem {
  /** integer, NOT NULL */
  id: number;
  /** text, NOT NULL */
  code: string;
  /** text, NOT NULL */
  planId: string;
  /** boolean, NOT NULL */
  isLeaf: boolean;
  /** integer, NOT NULL */
  hierarchyLevel: number;
  /** boolean, NOT NULL */
  isActive: boolean;
  /** uuid, NOT NULL */
  uniqueId: string;
  /** integer, NOT NULL */
  lineOrder: number;
  /** text, NULLABLE */
  label?: string;
  /** integer, NULLABLE */
  sysRecordVersion?: number;
  /** uuid, NULLABLE */
  sysRecordVersionId?: string;
  /** integer, NULLABLE */
  parentId?: number;
  /** text, NULLABLE */
  fullPathCode?: string;
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