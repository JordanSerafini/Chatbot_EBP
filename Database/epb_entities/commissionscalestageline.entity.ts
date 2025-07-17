// commissionscalestageline.entity.ts
export interface CommissionScaleStageLine {
  /** uuid, NOT NULL */
  id: string;
  /** text, NOT NULL */
  commissionScaleId: string;
  /** numeric, NOT NULL */
  threshold: number;
  /** smallint, NOT NULL */
  formula: number;
  /** numeric, NOT NULL */
  amount: number;
  /** numeric, NOT NULL */
  percentage: number;
  /** timestamp, NULLABLE */
  sysCreatedDate?: Date;
  /** text, NULLABLE */
  sysCreatedUser?: string;
  /** timestamp, NULLABLE */
  sysModifiedDate?: Date;
  /** text, NULLABLE */
  sysModifiedUser?: string;
} 