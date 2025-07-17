// address.entity.ts
export interface Address {
  /** uuid, NOT NULL */
  id: string;
  /** boolean, NOT NULL */
  isInvoicingType: boolean;
  /** boolean, NOT NULL */
  isDeliveryType: boolean;
  /** boolean, NOT NULL */
  isMainInvoicing: boolean;
  /** boolean, NOT NULL */
  isMainDelivery: boolean;
  /** boolean, NOT NULL */
  addressFieldsNpai: boolean;
  /** boolean, NOT NULL */
  isMainReminder: boolean;
  // Champs NULLABLE
  /** text, NULLABLE */
  addressFieldsWebSite?: string;
  /** numeric, NULLABLE */
  addressFieldsLongitude?: number;
  /** numeric, NULLABLE */
  addressFieldsLatitude?: number;
  /** text, NULLABLE */
  associatedCustomerId?: string;
  /** text, NULLABLE */
  associatedSupplierId?: string;
  /** integer, NULLABLE */
  sysEditCounter?: number;
  /** text, NULLABLE */
  addressFieldsAddress1?: string;
  /** text, NULLABLE */
  addressFieldsAddress2?: string;
  /** text, NULLABLE */
  addressFieldsAddress3?: string;
  /** text, NULLABLE */
  addressFieldsAddress4?: string;
  /** text, NULLABLE */
  addressFieldsZipCode?: string;
  /** text, NULLABLE */
  addressFieldsCity?: string;
  /** text, NULLABLE */
  addressFieldsState?: string;
  /** text, NULLABLE */
  addressFieldsCountryIsoCode?: string;
  /** text, NULLABLE */
  addressFieldsDescription?: string;
  /** text, NULLABLE */
  addressFieldsCivility?: string;
  /** text, NULLABLE */
  addressFieldsThirdName?: string;
  /** timestamp, NULLABLE */
  sysCreatedDate?: Date;
  /** text, NULLABLE */
  sysCreatedUser?: string;
  /** timestamp, NULLABLE */
  sysModifiedDate?: Date;
  /** text, NULLABLE */
  sysModifiedUser?: string;
  /** text, NULLABLE */
  addressFieldsCodeInsee?: string;
  /** text, NULLABLE */
  addressFieldsCityInsee?: string;
} 