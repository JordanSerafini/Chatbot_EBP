// item.entity.ts
export interface Item {
  /** smallint, NOT NULL */
  barCodePrice: number;
  /** smallint, NOT NULL */
  barCodeWeight: number;
  /** boolean, NOT NULL */
  posAddItem: boolean;
  /** numeric, NOT NULL */
  loyaltyPoints: number;
  /** smallint, NOT NULL */
  calculateLoyaltyFrom: number;
  /** boolean, NOT NULL */
  giftVoucher: boolean;
  /** boolean, NOT NULL */
  intrastatExcluded: boolean;
  /** boolean, NOT NULL */
  createCustomerProductInCustomerPark: boolean;
  /** boolean, NOT NULL */
  isMaintenanceContract: boolean;
  /** boolean, NOT NULL */
  isGuaranteeExtension: boolean;
  /** smallint, NOT NULL */
  customerParkCreation: number;
  /** boolean, NOT NULL */
  stockBookingAllowed: boolean;
  /** boolean, NOT NULL */
  automaticStockBooking: boolean;
  /** boolean, NOT NULL */
  includeToRecursiveReplenishment: boolean;
  /** boolean, NOT NULL */
  includeToFabricationReplenishment: boolean;
  /** boolean, NOT NULL */
  includeToSupplierReplenishment: boolean;
  /** integer, NOT NULL */
  cadenceQuantity: number;
  /** integer, NOT NULL */
  cadenceNumberOfDays: number;
  /** boolean, NOT NULL */
  doNotAssortAssemblyRequestsWithDifferentDates: boolean;
  /** integer, NOT NULL */
  maximumGapDayToAssort: number;
  /** smallint, NOT NULL */
  nomenclatureAccountingTransferTypeForSale: number;
  /** smallint, NOT NULL */
  nomenclatureAccountingTransferTypeForPurchase: number;
  /** numeric, NOT NULL */
  virtualPump: number;
  /** numeric, NOT NULL */
  virtualStockValue: number;
  /** numeric, NOT NULL */
  bookedQuantity: number;
  /** boolean, NOT NULL */
  purchaseBillOfQuantitiesProgramKeepActiveFromQuoteToOrder: boolean;
  /** boolean, NOT NULL */
  notOnMarket: boolean;
  /** boolean, NOT NULL */
  purchaseUnitPriceProgramKeepActiveFromQuoteToOrder: boolean;
  /** boolean, NOT NULL */
  canBePartiallyDelivered: boolean;
  /** text, NOT NULL */
  caption: string;
  /** numeric, NOT NULL */
  oxatisOxatisHandlingSurcharge1St: number;
  /** numeric, NOT NULL */
  oxatisOxatisHandlingSurchargeOthers: number;
  /** boolean, NOT NULL */
  interventionDurationEqualsQuantity: boolean;
  /** numeric, NOT NULL */
  height: number;
  /** numeric, NOT NULL */
  width: number;
  /** numeric, NOT NULL */
  length: number;
  /** boolean, NOT NULL */
  oxatisOxatisUseSubFamilyAsBrand: boolean;
  /** boolean, NOT NULL */
  isManagedByCounterMark: boolean;
  /** boolean, NOT NULL */
  isCounterMarkForced: boolean;
  /** numeric, NOT NULL */
  salePurchaseConversionRate: number;
  /** smallint, NOT NULL */
  limitDateMode: number;
  /** smallint, NOT NULL */
  limitDateSafetyDelay: number;
  /** uuid, NOT NULL */
  uniqueId: string;
  /** numeric, NOT NULL */
  purchasePrice: number;
  /** numeric, NOT NULL */
  chargeRate: number;
  /** numeric, NOT NULL */
  chargeAmount: number;
  /** numeric, NOT NULL */
  costPrice: number;
  /** numeric, NOT NULL */
  interestRate: number;
  /** numeric, NOT NULL */
  interestAmount: number;
  /** numeric, NOT NULL */
  salePriceVatExcluded: number;
  /** numeric, NOT NULL */
  brandRate: number;
  /** numeric, NOT NULL */
  vatAmount: number;
  /** numeric, NOT NULL */
  salePriceVatIncluded: number;
  /** boolean, NOT NULL */
  manageStock: boolean;
  /** numeric, NOT NULL */
  realStock: number;
  /** numeric, NOT NULL */
  pump: number;
  /** numeric, NOT NULL */
  stockValue: number;
  /** numeric, NOT NULL */
  orderedQuantity: number;
  /** numeric, NOT NULL */
  suppliersOrderedQuantity: number;
  /** numeric, NOT NULL */
  virtualStock: number;
  /** numeric, NOT NULL */
  defaultQuantity: number;
  /** numeric, NOT NULL */
  volume: number;
  /** numeric, NOT NULL */
  weight: number;
  /** numeric, NOT NULL */
  netWeight: number;
  /** numeric, NOT NULL */
  componentsPurchasePrice: number;
  /** numeric, NOT NULL */
  componentsCostPrice: number;
  /** numeric, NOT NULL */
  componentsSalePriceVatExcluded: number;
  /** numeric, NOT NULL */
  componentsSalePriceVatIncluded: number;
  /** smallint, NOT NULL */
  printComponentDetail: number;
  /** numeric, NOT NULL */
  assemblingVirtualQuantity: number;
  /** numeric, NOT NULL */
  disassemblingQuantity: number;
  /** numeric, NOT NULL */
  quantityUsedToAssemblate: number;
  /** numeric, NOT NULL */
  quantityFromDisassembling: number;
  /** boolean, NOT NULL */
  allowNegativeStock: boolean;
  /** boolean, NOT NULL */
  useComponentVat: boolean;
  /** boolean, NOT NULL */
  applyPriceListOnComponents: boolean;
  /** smallint, NOT NULL */
  activeState: number;
  /** numeric, NOT NULL */
  advisedSalePriceVatExcluded: number;
  /** boolean, NOT NULL */
  setItemSalePriceWithAdvisedSalePrice: boolean;
  /** smallint, NOT NULL */
  trackingMode: number;
  /** boolean, NOT NULL */
  allowComponentsModification: boolean;
  /** boolean, NOT NULL */
  allowPublishOnWeb: boolean;
  /** integer, NOT NULL */
  imageVersion: number;
  /** smallint, NOT NULL */
  priceDecimalNumber: number;
  /** boolean, NOT NULL */
  isHumanServicesIncludedInAttestation: boolean;
  /** boolean, NOT NULL */
  oxatisOxatisShowInStockNote: boolean;
  /** boolean, NOT NULL */
  oxatisOxatisShowStockLevel: boolean;
  /** boolean, NOT NULL */
  oxatisOxatisShowIfOutOfStock: boolean;
  /** boolean, NOT NULL */
  oxatisOxatisSaleIfOutOfStock: boolean;
  /** integer, NOT NULL */
  oxatisOxatisSaleIfOutOfStockScenario: number;
  /** boolean, NOT NULL */
  oxatisOxatisShowDaysToship: boolean;
  /** numeric, NOT NULL */
  oxatisOxatisShipPrice: number;
  /** integer, NOT NULL */
  oxatisOxatisDaysToship: number;
  /** boolean, NOT NULL */
  oxatisOxatisUserMainSupplierDaysToship: boolean;
  /** text, NOT NULL */
  id: string;
  /** smallint, NOT NULL */
  itemType: number;
  /** boolean, NOT NULL */
  billOfQuantitiesProgramKeepActiveFromQuoteToOrder: boolean;
  /** boolean, NOT NULL */
  saleUnitPriceProgramKeepActiveFromQuoteToOrder: boolean;
  /** boolean, NOT NULL */
  updateComponentsStockInFabrication: boolean;
  /** numeric, NOT NULL */
  customersDeliveryOrderPreparingQuantity: number;
  /** numeric, NOT NULL */
  customersReturnOrderPreparingQuantity: number;
  /** numeric, NOT NULL */
  suppliersDeliveryOrderPreparingQuantity: number;
  /** numeric, NOT NULL */
  suppliersReturnOrderPreparingQuantity: number;
  /** boolean, NOT NULL */
  stockBillOfQuantitiesProgramKeepActiveFromQuoteToOrder: boolean;
  /** numeric, NOT NULL */
  purchaseChargesRate: number;
  /** boolean, NOT NULL */
  posIsScale: boolean;
  /** numeric, NULLABLE */
  posTare?: number;
  /** text, NULLABLE */
  billOfQuantitiesProgramProgram?: string;
  /** smallint, NULLABLE */
  replenishmentDeliveryAddressType?: number;
  /** text, NULLABLE */
  saleUnitPriceProgramProgram?: string;
  /** text, NULLABLE */
  desCom?: string;
  /** text, NULLABLE */
  desComClear?: string;
  /** bytea, NULLABLE */
  itemImage?: Uint8Array;
  /** text, NULLABLE */
  barCode?: string;
  /** text, NULLABLE */
  unitId?: string;
  /** text, NULLABLE */
  familyId?: string;
  /** text, NULLABLE */
  subFamilyId?: string;
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
  /** smallint, NULLABLE */
  oxatisOxatisCategoryType1?: number;
  /** smallint, NULLABLE */
  oxatisOxatisCategoryType2?: number;
  /** smallint, NULLABLE */
  oxatisOxatisCategoryType3?: number;
  /** uuid, NULLABLE */
  oxatisOxatisCategoryId1?: string;
  /** uuid, NULLABLE */
  oxatisOxatisCategoryId2?: string;
  /** uuid, NULLABLE */
  oxatisOxatisCategoryId3?: string;
  /** text, NULLABLE */
  oxatisOxatisMetaTitle?: string;
  /** text, NULLABLE */
  oxatisOxatisMetaDescription?: string;
  /** text, NULLABLE */
  oxatisOxatisMetaKeywords?: string;
  /** text, NULLABLE */
  oxatisOxatisBrand?: string;
  /** text, NULLABLE */
  mainIntervener?: string;
  /** text, NULLABLE */
  intrastatNc8NomenclatureId?: string;
  /** uuid, NULLABLE */
  group1?: string;
  /** uuid, NULLABLE */
  group2?: string;
  /** smallint, NULLABLE */
  notPrintable?: number;
  /** smallint, NULLABLE */
  notIncluded?: number;
  /** smallint, NULLABLE */
  isFixedPrice?: number;
  /** smallint, NULLABLE */
  nonInvoiceableType?: number;
  /** smallint, NULLABLE */
  componentCalculationType?: number;
  /** text, NULLABLE */
  replacementItem?: string;
  /** text, NULLABLE */
  weightUnitId?: string;
  /** integer, NULLABLE */
  numberOfItemByPackage?: number;
  /** text, NULLABLE */
  volumeUnitId?: string;
  /** text, NULLABLE */
  supplierId?: string;
  /** text, NULLABLE */
  ecotaxId?: string;
  /** smallint, NULLABLE */
  stockDestination?: number;
  /** text, NULLABLE */
  stockVarianceAccount?: string;
  /** text, NULLABLE */
  currentStockAccount?: string;
  /** uuid, NULLABLE */
  vatId?: string;
  /** uuid, NULLABLE */
  sysModuleId?: string;
  /** uuid, NULLABLE */
  sysDatabaseId?: string;
  /** integer, NULLABLE */
  sysRecordVersion?: number;
  /** uuid, NULLABLE */
  sysRecordVersionId?: string;
  /** integer, NULLABLE */
  sysEditCounter?: number;
  /** smallint, NULLABLE */
  limitDateSafetyDelayMode?: number;
  /** smallint, NULLABLE */
  defaultLifeTime?: number;
  /** smallint, NULLABLE */
  purchasePriceUpdateType?: number;
  /** text, NULLABLE */
  analyticAccountingGridId?: string;
  /** text, NULLABLE */
  purchaseUnitId?: string;
  /** text, NULLABLE */
  dimensionUnitId?: string;
  /** text, NULLABLE */
  oxatisOxatisLongDescription?: string;
  /** text, NULLABLE */
  oxatisOxatisLongDescriptionClear?: string;
  /** bytea, NULLABLE */
  oxatisOxatisSmallImage?: Uint8Array;
  /** text, NULLABLE */
  purchaseBillOfQuantitiesProgramProgram?: string;
  /** text, NULLABLE */
  ecotaxFurnitureId?: string;
  /** text, NULLABLE */
  purchaseUnitPriceProgramProgram?: string;
  /** text, NULLABLE */
  localizableCaption2?: string;
  /** text, NULLABLE */
  localizableDesCom2?: string;
  /** text, NULLABLE */
  localizableDesComClear2?: string;
  /** text, NULLABLE */
  localizableCaption3?: string;
  /** text, NULLABLE */
  localizableCaption4?: string;
  /** text, NULLABLE */
  localizableCaption5?: string;
  /** text, NULLABLE */
  localizableDesCom3?: string;
  /** text, NULLABLE */
  localizableDesComClear3?: string;
  /** text, NULLABLE */
  localizableDesCom4?: string;
  /** text, NULLABLE */
  localizableDesComClear4?: string;
  /** text, NULLABLE */
  localizableDesCom5?: string;
  /** text, NULLABLE */
  localizableDesComClear5?: string;
  /** text, NULLABLE */
  intrastatOriginCountryId?: string;
  /** text, NULLABLE */
  parentRangeItemId?: string;
  /** uuid, NULLABLE */
  rangeTypeElementId0?: string;
  /** uuid, NULLABLE */
  rangeTypeElementId1?: string;
  /** uuid, NULLABLE */
  rangeTypeElementId2?: string;
  /** uuid, NULLABLE */
  rangeTypeElementId3?: string;
  /** uuid, NULLABLE */
  rangeTypeElementId4?: string;
  /** uuid, NULLABLE */
  defaultAllowedStorehouseId?: string;
  /** text, NULLABLE */
  maintenanceContractTemplateId?: string;
  /** text, NULLABLE */
  guaranteeTypeId?: string;
  /** text, NULLABLE */
  stockBillOfQuantitiesProgramProgram?: string;
  /** bytea, NULLABLE */
  posThumbnail?: Uint8Array;
  /** numeric, NULLABLE */
  giftVoucherCashValue?: number;
  /** smallint, NULLABLE */
  giftVoucherValidityDuration?: number;
  /** boolean, NOT NULL */
  canBePartiallyInvoiced: boolean;
  /** boolean, NOT NULL */
  pickMovementDisallowedOnTotallyBookedItem: boolean;
  /** boolean, NOT NULL */
  isExtraFee: boolean;
  /** timestamp, NULLABLE */
  salePriceModifiedDate?: Date;
  /** text, NULLABLE */
  salePriceModifiedUserId?: string;
  /** boolean, NOT NULL */
  subjectToIrpf: boolean;
  /** text, NULLABLE */
  competenceId?: string;
  /** text, NULLABLE */
  equipmentTypeId?: string;
  /** text, NULLABLE */
  scheduleEventTemplateId?: string;
  /** integer, NULLABLE */
  competenceNumberToPlan?: number;
  /** integer, NULLABLE */
  equipmentTypeNumberToPlan?: number;
  /** boolean, NOT NULL */
  isSubscription: boolean;
  /** smallint, NOT NULL */
  subscriptionPassings: number;
  /** numeric, NOT NULL */
  subscriptionTotalCostPrice: number;
  /** numeric, NOT NULL */
  subscriptionTotalPurchasePrice: number;
  /** numeric, NOT NULL */
  subscriptionTotalSalePriceVatExcluded: number;
  /** smallint, NOT NULL */
  subscriptionValidityDuration: number;
  /** smallint, NOT NULL */
  vatType: number;
  /** numeric, NOT NULL */
  vatOnMarginBase: number;
  /** numeric, NOT NULL */
  vatOnMarginRate: number;
  /** smallint, NULLABLE */
  oxatisOxatisCategoryType4?: number;
  /** smallint, NULLABLE */
  oxatisOxatisCategoryType5?: number;
  /** smallint, NULLABLE */
  oxatisOxatisCategoryType6?: number;
  /** smallint, NULLABLE */
  oxatisOxatisCategoryType7?: number;
  /** smallint, NULLABLE */
  oxatisOxatisCategoryType8?: number;
  /** smallint, NULLABLE */
  oxatisOxatisCategoryType9?: number;
  /** smallint, NULLABLE */
  oxatisOxatisCategoryType10?: number;
  /** uuid, NULLABLE */
  oxatisOxatisCategoryId4?: string;
  /** uuid, NULLABLE */
  oxatisOxatisCategoryId5?: string;
  /** uuid, NULLABLE */
  oxatisOxatisCategoryId6?: string;
  /** uuid, NULLABLE */
  oxatisOxatisCategoryId7?: string;
  /** uuid, NULLABLE */
  oxatisOxatisCategoryId8?: string;
  /** uuid, NULLABLE */
  oxatisOxatisCategoryId9?: string;
  /** uuid, NULLABLE */
  oxatisOxatisCategoryId10?: string;
  /** smallint, NULLABLE */
  giftVoucherCashType?: number;
  /** integer, NOT NULL */
  shelfRef: number;
  /** smallint, NULLABLE */
  subscriptionType?: number;
  /** smallint, NULLABLE */
  excludedFromFooterDiscount?: number;
  /** smallint, NULLABLE */
  excludedFromFinancialDiscount?: number;
  /** text, NULLABLE */
  xxRefFabricant?: string;
  /** text, NULLABLE */
  serviceType?: string;
  /** timestamp, NULLABLE */
  nextScheduledItemPriceUpdateDate?: Date;
  /** boolean, NOT NULL */
  sustainable: boolean;
} 