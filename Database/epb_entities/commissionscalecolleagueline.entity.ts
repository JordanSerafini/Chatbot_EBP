// commissionscalecolleagueline.entity.ts
export interface CommissionScaleColleagueLine {
  /** integer, NOT NULL */
  commissionOrder: number;
  /** uuid, NOT NULL */
  id: string;
  /** text, NOT NULL */
  commissionScaleId: string;
  /** text, NULLABLE */
  colleagueId?: string;
  /** text, NULLABLE */
  colleagueFamilyId?: string;
  /** timestamp, NULLABLE */
  sysCreatedDate?: Date;
  /** text, NULLABLE */
  sysCreatedUser?: string;
  /** timestamp, NULLABLE */
  sysModifiedDate?: Date;
  /** text, NULLABLE */
  sysModifiedUser?: string;
} 