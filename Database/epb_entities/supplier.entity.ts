// supplier.entity.ts
export interface Supplier {
  /** boolean, NOT NULL */
  assortDeliveryByOrder: boolean;
  /** boolean, NOT NULL */
  disallowOrderAssort: boolean;
  /** boolean, NOT NULL */
  disallowDeliveryAssort: boolean;
  /** smallint, NOT NULL */
  vatMode: number;
  /** numeric, NOT NULL */
  extendedCurrentAmount: number;
  /** numeric, NOT NULL */
  thresholdBeforeExceedAmount: number;
  /** text, NOT NULL */
  id: string;
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
  /** boolean, NOT NULL */
  mainInvoicingContactNaturalPerson: boolean;
  /** boolean, NOT NULL */
  mainInvoicingContactOptIn: boolean;
  /** boolean, NOT NULL */
  naturalPerson: boolean;
  /** uuid, NOT NULL */
  territorialityId: string;
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
  /** smallint, NOT NULL */
  financialDiscountType: number;
  /** numeric, NOT NULL */
  financialDiscountRate: number;
  /** smallint, NOT NULL */
  financialDiscountPaymentDelay: number;
  /** smallint, NOT NULL */
  activeState: number;
  /** boolean, NOT NULL */
  mustRetrieveCommitmentsFromAccounting: boolean;
  /** numeric, NOT NULL */
  irpfRate: number;
  /** uuid, NOT NULL */
  uniqueId: string;
  /** text, NOT NULL */
  thirdLanguage: string;
  /** numeric, NOT NULL */
  invoicingChargesAmount: number;
  /** boolean, NOT NULL */
  isSelfBilling: boolean;
  /** numeric, NOT NULL */
  postagePaidThreshold: number;
  /** boolean, NULLABLE */
  mainDeliveryContactAllowUsePersonnalDatas?: boolean;
  /** boolean, NULLABLE */
  mainInvoicingContactAllowUsePersonnalDatas?: boolean;
  /** text, NULLABLE */
  accountsAuxiliaryAccount?: string;
  /** integer, NULLABLE */
  schedulerColor?: number;
  /** text, NULLABLE */
  selfBillingId?: string;
  /** text, NULLABLE */
  selfBillingInvoiceObligatoryMentions?: string;
  /** text, NULLABLE */
  selfBillingInvoiceObligatoryMentionsClear?: string;
  /** uuid, NULLABLE */
  invoicingChargesVatId?: string;
  /** timestamp, NULLABLE */
  lastInvoicingDate?: Date;
  /** text, NULLABLE */
  documentPrintMention?: string;
  /** integer, NULLABLE */
  sysRecordVersion?: number;
  /** uuid, NULLABLE */
  sysRecordVersionId?: string;
  /** integer, NULLABLE */
  sysEditCounter?: number;
  /** text, NULLABLE */
  documentSerialId?: string;
  /** smallint, NULLABLE */
  identificationType?: number;
  /** text, NULLABLE */
  analyticAccountingGridId?: string;
  /** text, NULLABLE */
  currencyId?: string;
  /** uuid, NULLABLE */
  group1?: string;
  /** uuid, NULLABLE */
  group2?: string;
  /** text, NULLABLE */
  colleagueId?: string;
  /** text, NULLABLE */
  accountsAccount?: string;
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
  /** text, NULLABLE */
  civility?: string;
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
  shippingId?: string;
  /** text, NULLABLE */
  paymentThirdId?: string;
  /** text, NULLABLE */
  invoicingThirdId?: string;
  /** boolean, NOT NULL */
  applyItemOtherTax: boolean;
  /** text, NULLABLE */
  iduCode?: string;
  /** text, NULLABLE */
  cnpsCode?: string;
  /** text, NULLABLE */
  mainDeliveryContactProfession?: string;
  /** text, NULLABLE */
  mainInvoicingContactProfession?: string;
  /** smallint, NOT NULL */
  supplierType: number;
  /** text, NULLABLE */
  urssafId?: string;
  /** boolean, NOT NULL */
  isEcotaxFurnitureBasedOnAmountVatIncluded: boolean;
  /** text, NULLABLE */
  mainDeliveryAddressCodeInsee?: string;
  /** text, NULLABLE */
  mainDeliveryAddressCityInsee?: string;
  /** text, NULLABLE */
  mainInvoicingAddressCodeInsee?: string;
  /** text, NULLABLE */
  mainInvoicingAddressCityInsee?: string;
  /** text, NULLABLE */
  businessTaxCode?: string;
  /** text, NULLABLE */
  cnieCode?: string;
} 