// accountingyear.entity.ts
export interface AccountingYear {
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
  /** uuid, NOT NULL */
  id: string;
  /** boolean, NOT NULL */
  isCurrent: boolean;
  /** timestamp, NOT NULL */
  startingDate: Date;
  /** timestamp, NOT NULL */
  endingDate: Date;
  /** smallint, NOT NULL */
  status: number;
  /** timestamp, NULLABLE */
  closingDate?: Date;
  /** uuid, NULLABLE */
  synchronizationUniqueId?: string;
  /** text, NOT NULL */
  caption: string;
} 