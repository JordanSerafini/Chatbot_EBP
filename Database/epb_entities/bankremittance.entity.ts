// bankremittance.entity.ts
export interface BankRemittance {
  /** uuid, NOT NULL */
  id: string;
  /** text, NOT NULL */
  bankRemittanceNumber: string;
  /** timestamp, NOT NULL */
  bankRemittanceDate: Date;
  /** text, NOT NULL */
  bankId: string;
  /** text, NOT NULL */
  paymentTypeId: string;
  /** smallint, NOT NULL */
  bankRemittanceState: number;
  /** numeric, NOT NULL */
  amount: number;
  /** numeric, NOT NULL */
  currencyAmount: number;
  /** boolean, NOT NULL */
  cfonbFileGenerated: boolean;
  /** numeric, NOT NULL */
  currencyConversionRate: number;
  /** smallint, NOT NULL */
  remittanceType: number;
  /** boolean, NOT NULL */
  accountingTransferWithCommitmentDate: boolean;
  /** numeric, NOT NULL */
  chargeAmounts0: number;
  /** numeric, NOT NULL */
  chargeAmounts1: number;
  /** numeric, NOT NULL */
  chargeAmounts2: number;
  /** numeric, NOT NULL */
  chargeAmounts3: number;
  /** numeric, NOT NULL */
  chargeAmounts4: number;
  /** numeric, NOT NULL */
  currencyChargeAmounts0: number;
  /** numeric, NOT NULL */
  currencyChargeAmounts1: number;
  /** numeric, NOT NULL */
  currencyChargeAmounts2: number;
  /** numeric, NOT NULL */
  currencyChargeAmounts3: number;
  /** numeric, NOT NULL */
  currencyChargeAmounts4: number;
  /** boolean, NOT NULL */
  useRemittanceAccountsForAccountingTransfer: boolean;
  /** boolean, NOT NULL */
  containsUnpaidSettlement: boolean;
  // Champs NULLABLE
  /** timestamp, NULLABLE */
  collectionDate?: Date;
  /** timestamp, NULLABLE */
  chargesEntryDate?: Date;
  /** text, NULLABLE */
  lastSepaMessageId?: string;
  /** text, NULLABLE */
  currencyId?: string;
  /** uuid, NULLABLE */
  accountingExchangeGroupId?: string;
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
  chargesAccountingEntryId?: string;
} 