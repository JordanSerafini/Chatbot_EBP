// customer.entity.ts
export interface Customer {
  /** boolean, NOT NULL */
  checkExceedCommitmentDate: boolean;
  /** integer, NOT NULL */
  dueCommitmentsXDay: number;
  /** numeric, NOT NULL */
  effectOfTradeAmount: number;
  /** boolean, NOT NULL */
  generateVcs: boolean;
  /** text, NOT NULL */
  thirdLanguage: string;
  /** numeric, NOT NULL */
  invoicingChargesAmount: number;
  /** boolean, NOT NULL */
  automaticStockBooking: boolean;
  /** smallint, NOT NULL */
  customerToUseInCustomerProducts: number;
  /** numeric, NOT NULL */
  extendedCurrentAmount: number;
  /** numeric, NOT NULL */
  thresholdBeforeExceedAmount: number;
  /** text, NOT NULL */
  name: string;
  /** boolean, NOT NULL */
  useInvoicingAddressAsDeliveryAddress: boolean;
  /** boolean, NOT NULL */
  useInvoicingContactAsDeliveryContact: boolean;
  /** boolean, NOT NULL */
  mainDeliveryAddressNpai: boolean;
  /** boolean, NOT NULL */
  mainInvoicingAddressNpai: boolean;
  /** boolean, NOT NULL */
  mainDeliveryContactNaturalPerson: boolean;
  /** boolean, NOT NULL */
  mainDeliveryContactOptIn: boolean;
  /** text, NOT NULL */
  id: string;
  /** boolean, NOT NULL */
  mainInvoicingContactNaturalPerson: boolean;
  /** boolean, NOT NULL */
  mainInvoicingContactOptIn: boolean;
  /** boolean, NOT NULL */
  naturalPerson: boolean;
  /** uuid, NOT NULL */
  territorialityId: string;
  /** smallint, NOT NULL */
  financialDiscountType: number;
  /** numeric, NOT NULL */
  financialDiscountRate: number;
  /** smallint, NOT NULL */
  financialDiscountPaymentDelay: number;
  /** smallint, NOT NULL */
  activeState: number;
  /** numeric, NOT NULL */
  discountRate: number;
  /** numeric, NOT NULL */
  secondDiscountRate: number;
  /** numeric, NOT NULL */
  allowedAmount: number;
  /** numeric, NOT NULL */
  currentAmount: number;
  /** numeric, NOT NULL */
  initialAmount: number;
  /** numeric, NOT NULL */
  exceedAmount: number;
  /** boolean, NOT NULL */
  mustRetrieveCommitmentsFromAccounting: boolean;
  /** boolean, NOT NULL */
  priceWithTaxBased: boolean;
  /** boolean, NOT NULL */
  mustBeReminder: boolean;
  /** integer, NOT NULL */
  dayNumberToFirstReminder: number;
  /** integer, NOT NULL */
  dayNumberToSecondReminder: number;
  /** integer, NOT NULL */
  dayNumberToThirdReminder: number;
  /** boolean, NOT NULL */
  isCustomerAccount: boolean;
  /** smallint, NOT NULL */
  webContactSendKind: number;
  /** boolean, NOT NULL */
  subjectToRe: boolean;
  /** uuid, NOT NULL */
  uniqueId: string;
  /** boolean, NOT NULL */
  disallowOrderAssort: boolean;
  /** boolean, NOT NULL */
  disallowDeliveryAssort: boolean;
  /** boolean, NOT NULL */
  sendReminderToPayerThird: boolean;
  /** boolean, NOT NULL */
  xxEnvoiCarteVoeux: boolean;
  /** boolean, NOT NULL */
  assortDeliveryByOrder: boolean;
  /** boolean, NOT NULL */
  createPosDeliveryOrderByDefault: boolean;
  /** smallint, NOT NULL */
  loyaltyOriginReportType: number;
  /** numeric, NOT NULL */
  loyaltyOriginReportValue: number;
  /** numeric, NOT NULL */
  loyaltyValue: number;
  /** boolean, NOT NULL */
  xxDesabonneNewsletter: boolean;
  /** boolean, NOT NULL */
  allowUsePersonnalDatas: boolean;
  /** numeric, NOT NULL */
  loyaltyCumulativeTurnoverReport: number;
  /** numeric, NOT NULL */
  loyaltyCumulativeTurnover: number;
  /** boolean, NOT NULL */
  showTechnicalSheetOnFront: boolean;
  /** boolean, NOT NULL */
  xxEnvoiFactureParMail: boolean;
  /** boolean, NOT NULL */
  xxContratMaintenanceEbp: boolean;
  // Champs NULLABLE
  /** text, NULLABLE */
  loyaltyCardType?: string;
  /** text, NULLABLE */
  loyaltyCardId?: string;
  /** timestamp, NULLABLE */
  loyaltyCardCreationDate?: Date;
  /** smallint, NULLABLE */
  loyaltyCardValidityDuration?: number;
  /** timestamp, NULLABLE */
  loyaltyCardExpiryDate?: Date;
  /** timestamp, NULLABLE */
  loyaltyCardRenewalDate?: Date;
  /** integer, NULLABLE */
  sysRecordVersion?: number;
  /** uuid, NULLABLE */
  sysRecordVersionId?: string;
  /** integer, NULLABLE */
  sysEditCounter?: number;
  /** uuid, NULLABLE */
  selectedReminderReport?: string;
  /** text, NULLABLE */
  shippingId?: string;
  /** text, NULLABLE */
  documentSerialId?: string;
  /** smallint, NULLABLE */
  identificationType?: number;
  /** text, NULLABLE */
  analyticAccountingGridId?: string;
  /** smallint, NULLABLE */
  type?: number;
  /** text, NULLABLE */
  accountsAccount?: string;
  /** text, NULLABLE */
  currencyId?: string;
  /** uuid, NULLABLE */
  group1?: string;
  /** uuid, NULLABLE */
  group2?: string;
  /** text, NULLABLE */
  colleagueId?: string;
  /** timestamp, NULLABLE */
  firstInvoicingDate?: Date;
  /** text, NULLABLE */
  settlementModeId?: string;
  /** smallint, NULLABLE */
  paymentDate?: number;
  /** text, NULLABLE */
  priceListCategoryId?: string;
  /** text, NULLABLE */
  siren?: string;
  /** text, NULLABLE */
  naf?: string;
  /** text, NULLABLE */
  familyId?: string;
  /** text, NULLABLE */
  subFamilyId?: string;
  /** text, NULLABLE */
  intracommunityVatNumber?: string;
  /** text, NULLABLE */
  mainInvoicingContactExternalIdGoogleId?: string;
  /** text, NULLABLE */
  mainInvoicingContactExternalIdOutlookId?: string;
  /** text, NULLABLE */
  civility?: string;
  /** text, NULLABLE */
  mainDeliveryContactExternalIdGoogleId?: string;
  /** text, NULLABLE */
  mainDeliveryContactExternalIdOutlookId?: string;
  /** text, NULLABLE */
  mainInvoicingContactCivility?: string;
  /** text, NULLABLE */
  mainInvoicingContactName?: string;
  /** text, NULLABLE */
  mainInvoicingContactFirstName?: string;
  /** text, NULLABLE */
  mainInvoicingContactPhone?: string;
  /** text, NULLABLE */
  mainInvoicingContactCellPhone?: string;
  /** text, NULLABLE */
  mainInvoicingContactFax?: string;
  /** text, NULLABLE */
  mainInvoicingContactEmail?: string;
  /** text, NULLABLE */
  mainInvoicingContactFunction?: string;
  /** text, NULLABLE */
  mainInvoicingContactDepartment?: string;
  /** text, NULLABLE */
  mainInvoicingAddressWebSite?: string;
  /** numeric, NULLABLE */
  mainInvoicingAddressLongitude?: number;
  /** numeric, NULLABLE */
  mainInvoicingAddressLatitude?: number;
  /** text, NULLABLE */
  mainDeliveryContactCivility?: string;
  /** text, NULLABLE */
  mainDeliveryContactName?: string;
  /** text, NULLABLE */
  mainDeliveryContactFirstName?: string;
  /** text, NULLABLE */
  mainDeliveryContactPhone?: string;
  /** text, NULLABLE */
  mainDeliveryContactCellPhone?: string;
  /** text, NULLABLE */
  mainDeliveryContactFax?: string;
  /** text, NULLABLE */
  mainDeliveryContactEmail?: string;
  /** text, NULLABLE */
  mainDeliveryContactFunction?: string;
  /** text, NULLABLE */
  mainDeliveryContactDepartment?: string;
  /** text, NULLABLE */
  mainDeliveryAddressWebSite?: string;
  /** numeric, NULLABLE */
  mainDeliveryAddressLongitude?: number;
  /** numeric, NULLABLE */
  mainDeliveryAddressLatitude?: number;
  /** text, NULLABLE */
  mainInvoicingAddressAddress1?: string;
  /** text, NULLABLE */
  mainInvoicingAddressAddress2?: string;
  /** text, NULLABLE */
  mainInvoicingAddressAddress3?: string;
  /** text, NULLABLE */
  mainInvoicingAddressAddress4?: string;
  /** text, NULLABLE */
  mainInvoicingAddressZipCode?: string;
  /** text, NULLABLE */
  mainInvoicingAddressCity?: string;
  /** text, NULLABLE */
  mainInvoicingAddressState?: string;
  /** text, NULLABLE */
  mainInvoicingAddressCountryIsoCode?: string;
  /** text, NULLABLE */
  mainInvoicingAddressDescription?: string;
  /** text, NULLABLE */
  mainInvoicingAddressCivility?: string;
  /** text, NULLABLE */
  mainInvoicingAddressThirdName?: string;
  /** text, NULLABLE */
  mainDeliveryAddressAddress1?: string;
  /** text, NULLABLE */
  mainDeliveryAddressAddress2?: string;
  /** text, NULLABLE */
  mainDeliveryAddressAddress3?: string;
  /** text, NULLABLE */
  mainDeliveryAddressAddress4?: string;
  /** text, NULLABLE */
  mainDeliveryAddressZipCode?: string;
  /** text, NULLABLE */
  mainDeliveryAddressCity?: string;
  /** text, NULLABLE */
  mainDeliveryAddressState?: string;
  /** text, NULLABLE */
  mainDeliveryAddressCountryIsoCode?: string;
  /** text, NULLABLE */
  mainDeliveryAddressDescription?: string;
  /** text, NULLABLE */
  mainDeliveryAddressCivility?: string;
  /** text, NULLABLE */
  mainDeliveryAddressThirdName?: string;
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
  accountsBillOfExchangeAccountingAccount?: string;
  /** uuid, NULLABLE */
  taxIds0?: string;
  /** uuid, NULLABLE */
  taxIds1?: string;
  /** uuid, NULLABLE */
  taxIds2?: string;
  /** text, NULLABLE */
  paymentThirdId?: string;
  /** text, NULLABLE */
  invoicingThirdId?: string;
  /** uuid, NULLABLE */
  invoicingChargesVatId?: string;
  /** timestamp, NULLABLE */
  lastInvoicingDate?: Date;
  /** text, NULLABLE */
  documentPrintMention?: string;
  /** uuid, NULLABLE */
  storehouseId?: string;
  /** text, NULLABLE */
  accountsAuxiliaryAccount?: string;
  /** text, NULLABLE */
  accountsDoubtfulAccount?: string;
  /** integer, NULLABLE */
  schedulerColor?: number;
  /** text, NULLABLE */
  travelExpenseId?: string;
  /** boolean, NULLABLE */
  mainDeliveryContactAllowUsePersonnalDatas?: boolean;
  /** boolean, NULLABLE */
  mainInvoicingContactAllowUsePersonnalDatas?: boolean;
  /** text, NULLABLE */
  nic?: string;
  /** numeric, NULLABLE */
  depositPercentage?: number;
  /** text, NULLABLE */
  buyerReference?: string;
  /** text, NULLABLE */
  goCardLessThirdId?: string;
  /** uuid, NULLABLE */
  defaultBankAccountId?: string;
  /** text, NULLABLE */
  xxLoginTicket?: string;
  /** text, NULLABLE */
  xxMdpTicket?: string;
  /** text, NULLABLE */
  mainDeliveryAddressCodeInsee?: string;
  /** text, NULLABLE */
  mainDeliveryAddressCityInsee?: string;
  /** text, NULLABLE */
  mainInvoicingAddressCodeInsee?: string;
  /** text, NULLABLE */
  mainInvoicingAddressCityInsee?: string;
  /** text, NULLABLE */
  cnssCode?: string;
  /** text, NULLABLE */
  businessTaxCode?: string;
  /** text, NULLABLE */
  cnieCode?: string;
  /** boolean, NOT NULL */
  applyItemOtherTax: boolean;
  /** boolean, NOT NULL */
  assortMaintenanceContractInvoices: boolean;
  /** text, NULLABLE */
  headOfficeAddressAddress1?: string;
  /** text, NULLABLE */
  headOfficeAddressAddress2?: string;
  /** text, NULLABLE */
  headOfficeAddressAddress3?: string;
  /** text, NULLABLE */
  headOfficeAddressAddress4?: string;
  /** text, NULLABLE */
  headOfficeAddressZipCode?: string;
  /** text, NULLABLE */
  headOfficeAddressCity?: string;
  /** text, NULLABLE */
  headOfficeAddressState?: string;
  /** text, NULLABLE */
  headOfficeAddressCountryIsoCode?: string;
  /** text, NULLABLE */
  headOfficeAddressCodeInsee?: string;
  /** text, NULLABLE */
  headOfficeAddressCityInsee?: string;
  /** text, NULLABLE */
  headOfficeAddressHeadOfficeName?: string;
  /** boolean, NOT NULL */
  headOfficeAddressUseCompanyAddressAsHeadOfficeAddress: boolean;
  /** smallint, NOT NULL */
  neotouchSendingType: number;
  /** smallint, NOT NULL */
  neotouchDuplicateSendingType: number;
  /** text, NULLABLE */
  neotouchContactsIdForDuplicate?: string;
  /** smallint, NOT NULL */
  sendReceiptByMail: number;
  /** smallint, NOT NULL */
  printReceiptChoice: number;
  /** timestamp, NULLABLE */
  birthDate?: Date;
  /** text, NULLABLE */
  iduCode?: string;
  /** text, NULLABLE */
  cnpsCode?: string;
  /** text, NULLABLE */
  mainDeliveryContactProfession?: string;
  /** text, NULLABLE */
  mainInvoicingContactProfession?: string;
  /** text, NULLABLE */
  urssafId?: string;
  /** smallint, NULLABLE */
  customerTypology?: number;
} 