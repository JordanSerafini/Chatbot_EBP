// accountingexchangegroupprocessdetail.entity.ts
export interface AccountingExchangeGroupProcessDetail {
  /** integer, NOT NULL */
  id: number;
  /** uuid, NOT NULL */
  accountingExchangeGroupId: string;
  /** smallint, NOT NULL */
  processType: number;
  /** timestamp, NOT NULL */
  processDate: Date;
  /** text, NULLABLE */
  errors?: string;
  /** timestamp, NULLABLE */
  sysCreatedDate?: Date;
  /** text, NULLABLE */
  sysCreatedUser?: string;
  /** timestamp, NULLABLE */
  sysModifiedDate?: Date;
  /** text, NULLABLE */
  sysModifiedUser?: string;
} 