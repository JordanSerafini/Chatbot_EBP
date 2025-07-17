// accountingexchangegroup.entity.ts
export interface AccountingExchangeGroup {
  /** uuid, NOT NULL */
  id: string;
  /** integer, NOT NULL */
  groupNumber: number;
  /** boolean, NOT NULL */
  system: boolean;
  /** boolean, NOT NULL */
  transferedPieces: boolean;
  /** smallint, NOT NULL */
  processType: number;
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
} 