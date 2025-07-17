// cashmovement.entity.ts
export interface CashMovement {
  /** smallint, NOT NULL */
  accountingTransferState: number;
  /** uuid, NOT NULL */
  id: string;
  /** timestamp, NOT NULL */
  movementDateTime: Date;
  /** text, NOT NULL */
  caption: string;
  /** smallint, NOT NULL */
  movementType: number;
  /** numeric, NOT NULL */
  amount: number;
  /** text, NULLABLE */
  sourceSafeId?: string;
  /** text, NULLABLE */
  targetSafeId?: string;
  /** text, NULLABLE */
  sourceTerminalId?: string;
  /** text, NULLABLE */
  targetTerminalId?: string;
  /** uuid, NULLABLE */
  sourceTerminalOpenCloseId?: string;
  /** uuid, NULLABLE */
  targetTerminalOpenCloseId?: string;
  /** smallint, NULLABLE */
  accountingType?: number;
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
  /** uuid, NULLABLE */
  accountingExchangeGroupId?: string;
  /** uuid, NULLABLE */
  bankRemittanceId?: string;
  /** numeric, NULLABLE */
  bankRemittanceChargeAmounts0?: number;
  /** numeric, NULLABLE */
  bankRemittanceChargeAmounts1?: number;
  /** numeric, NULLABLE */
  bankRemittanceChargeAmounts2?: number;
  /** numeric, NULLABLE */
  bankRemittanceChargeAmounts3?: number;
  /** numeric, NULLABLE */
  bankRemittanceChargeAmounts4?: number;
} 