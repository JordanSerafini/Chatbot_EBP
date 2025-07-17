// commissionscale.entity.ts
export interface CommissionScale {
  /** smallint, NOT NULL */
  csScope: number;
  /** smallint, NOT NULL */
  objectiveType: number;
  /** smallint, NOT NULL */
  mode: number;
  /** smallint, NOT NULL */
  groupBy: number;
  /** uuid, NOT NULL */
  uniqueId: string;
  /** text, NOT NULL */
  id: string;
  /** text, NOT NULL */
  caption: string;
  /** timestamp, NULLABLE */
  dateBeginning?: Date;
  /** timestamp, NULLABLE */
  dateEnd?: Date;
  /** integer, NULLABLE */
  sysRecordVersion?: number;
  /** uuid, NULLABLE */
  sysRecordVersionId?: string;
  /** integer, NULLABLE */
  sysEditCounter?: number;
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