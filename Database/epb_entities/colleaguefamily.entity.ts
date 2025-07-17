// colleaguefamily.entity.ts
export interface ColleagueFamily {
  /** uuid, NOT NULL */
  id: string;
  /** text, NOT NULL */
  caption: string;
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