// civility.entity.ts
export interface Civility {
  /** uuid, NOT NULL */
  id: string;
  /** text, NOT NULL */
  caption: string;
  /** boolean, NOT NULL */
  naturalPerson: boolean;
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
  /** text, NULLABLE */
  localizableCaption2?: string;
  /** text, NULLABLE */
  localizableCaption3?: string;
  /** text, NULLABLE */
  localizableCaption4?: string;
  /** text, NULLABLE */
  localizableCaption5?: string;
} 