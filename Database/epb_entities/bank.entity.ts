// bank.entity.ts
export interface Bank {
  /** boolean, NOT NULL */
  formatSepaFile: boolean;
  /** boolean, NOT NULL */
  sepaFileUtf8Encoded: boolean;
  /** text, NOT NULL */
  id: string;
  /** text, NOT NULL */
  caption: string;
  /** text, NOT NULL */
  bankBook: string;
  /** text, NOT NULL */
  accountingAccount: string;
  /** boolean, NOT NULL */
  formatCfonbFile: boolean;
  /** uuid, NOT NULL */
  uniqueId: string;
  /** boolean, NOT NULL */
  sepaForceChrgBr: boolean;
  /** text, NOT NULL */
  billOfExchangeBook: string;
  /** text, NOT NULL */
  billForCollectionBook: string;
  /** text, NOT NULL */
  billForDiscountBook: string;
  /** text, NOT NULL */
  otherPaymentBook: string;
  /** text, NOT NULL */
  billForCollectionAccount: string;
  /** text, NOT NULL */
  billForDiscountAccount: string;
  /** text, NOT NULL */
  otherPaymentAccount: string;
  /** numeric, NOT NULL */
  bankRemittanceCharges0Amount: number;
  /** smallint, NOT NULL */
  bankRemittanceCharges0AmountType: number;
  /** text, NOT NULL */
  bankRemittanceCharges0Account: string;
  /** numeric, NOT NULL */
  bankRemittanceCharges1Amount: number;
  /** smallint, NOT NULL */
  bankRemittanceCharges1AmountType: number;
  /** text, NOT NULL */
  bankRemittanceCharges1Account: string;
  /** numeric, NOT NULL */
  bankRemittanceCharges2Amount: number;
  /** smallint, NOT NULL */
  bankRemittanceCharges2AmountType: number;
  /** text, NOT NULL */
  bankRemittanceCharges2Account: string;
  /** numeric, NOT NULL */
  bankRemittanceCharges3Amount: number;
  /** smallint, NOT NULL */
  bankRemittanceCharges3AmountType: number;
  /** text, NOT NULL */
  bankRemittanceCharges3Account: string;
  /** numeric, NOT NULL */
  bankRemittanceCharges4Amount: number;
  /** smallint, NOT NULL */
  bankRemittanceCharges4AmountType: number;
  /** text, NOT NULL */
  bankRemittanceCharges4Account: string;
  /** smallint, NOT NULL */
  sepaBatchBooking: number;
  /** boolean, NOT NULL */
  sepaSerializeDateTimeToLocalZone: boolean;
  /** boolean, NOT NULL */
  isInactive: boolean;
  // Champs NULLABLE
  /** text, NULLABLE */
  bankRemittanceCharges4PaymentTypes?: string;
  /** text, NULLABLE */
  bankRemittanceCharges3PaymentTypes?: string;
  /** text, NULLABLE */
  bankRemittanceCharges4Caption?: string;
  /** text, NULLABLE */
  bankRemittanceCharges2PaymentTypes?: string;
  /** text, NULLABLE */
  bankRemittanceCharges3Caption?: string;
  /** text, NULLABLE */
  bankRemittanceCharges1PaymentTypes?: string;
  /** text, NULLABLE */
  bankRemittanceCharges2Caption?: string;
  /** text, NULLABLE */
  bankRemittanceCharges0PaymentTypes?: string;
  /** text, NULLABLE */
  bankRemittanceCharges1Caption?: string;
  /** text, NULLABLE */
  bankRemittanceCharges0Caption?: string;
  /** uuid, NULLABLE */
  sysModuleId?: string;
  /** uuid, NULLABLE */
  sysDatabaseId?: string;
  /** integer, NULLABLE */
  sysRecordVersion?: number;
  /** uuid, NULLABLE */
  sysRecordVersionId?: string;
  /** text, NULLABLE */
  sepaCreditorIdentifier?: string;
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
  addressAddress1?: string;
  /** text, NULLABLE */
  addressAddress2?: string;
  /** text, NULLABLE */
  addressAddress3?: string;
  /** text, NULLABLE */
  addressAddress4?: string;
  /** text, NULLABLE */
  addressZipCode?: string;
  /** text, NULLABLE */
  addressCity?: string;
  /** text, NULLABLE */
  addressState?: string;
  /** text, NULLABLE */
  addressCountryIsoCode?: string;
  /** text, NULLABLE */
  addressBankName?: string;
  /** text, NULLABLE */
  addressWebSite?: string;
  /** numeric, NULLABLE */
  addressLongitude?: number;
  /** numeric, NULLABLE */
  addressLatitude?: number;
  /** text, NULLABLE */
  contactCivility?: string;
  /** text, NULLABLE */
  contactName?: string;
  /** text, NULLABLE */
  contactFirstName?: string;
  /** text, NULLABLE */
  contactPhone?: string;
  /** text, NULLABLE */
  contactCellPhone?: string;
  /** text, NULLABLE */
  contactFax?: string;
  /** text, NULLABLE */
  contactEmail?: string;
  /** text, NULLABLE */
  contactFunction?: string;
  /** text, NULLABLE */
  contactDepartment?: string;
  /** text, NULLABLE */
  accountDetailBasicBankAccountNumber?: string;
  /** text, NULLABLE */
  accountDetailInternationalBankAccountNumber?: string;
  /** text, NULLABLE */
  accountDetailBankIdentifierCode?: string;
  /** text, NULLABLE */
  nationalIssuerNumber?: string;
  /** text, NULLABLE */
  currencyId?: string;
  /** text, NULLABLE */
  bankCheckPrintingOrder?: string;
  /** text, NULLABLE */
  documentSerialId?: string;
  /** text, NULLABLE */
  addressCodeInsee?: string;
  /** text, NULLABLE */
  addressCityInsee?: string;
} 