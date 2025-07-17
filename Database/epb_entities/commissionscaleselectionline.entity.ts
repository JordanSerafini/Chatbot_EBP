// commissionscaleselectionline.entity.ts
export interface CommissionScaleSelectionLine {
  /** uuid, NOT NULL */
  id: string;
  /** text, NOT NULL */
  commissionScaleId: string;
  /** smallint, NOT NULL */
  selectionType: number;
  /** boolean, NOT NULL */
  exclude: boolean;
  /** integer, NOT NULL */
  selectionOrder: number;
  /** timestamp, NULLABLE */
  sysCreatedDate?: Date;
  /** text, NULLABLE */
  sysCreatedUser?: string;
  /** timestamp, NULLABLE */
  sysModifiedDate?: Date;
  /** text, NULLABLE */
  sysModifiedUser?: string;
  /** text, NULLABLE */
  idFrom?: string;
  /** text, NULLABLE */
  idTo?: string;
} 