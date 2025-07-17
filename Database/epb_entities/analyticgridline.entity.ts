// analyticgridline.entity.ts
export interface AnalyticGridLine {
  /** integer, NOT NULL */
  id: number;
  /** integer, NOT NULL */
  analyticPlanItem: number;
  /** numeric, NOT NULL */
  percentage: number;
  /** text, NOT NULL */
  analyticGridId: string;
  /** uuid, NOT NULL */
  uniqueId: string;
  /** timestamp, NULLABLE */
  sysCreatedDate?: Date;
  /** text, NULLABLE */
  sysCreatedUser?: string;
  /** timestamp, NULLABLE */
  sysModifiedDate?: Date;
  /** text, NULLABLE */
  sysModifiedUser?: string;
} 