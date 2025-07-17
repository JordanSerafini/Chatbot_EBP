// classificationgroup.entity.ts
export interface ClassificationGroup {
  /** uuid, NOT NULL */
  id: string;
  /** text, NOT NULL */
  caption: string;
  /** smallint, NOT NULL */
  groupType: number;
  /** text, NULLABLE */
  analyticAccountingGridId?: string;
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