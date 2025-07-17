// activity.entity.ts
export interface Activity {
  /** uuid, NOT NULL */
  id: string;
  /** timestamp, NOT NULL */
  startDateTime: Date;
  /** timestamp, NOT NULL */
  endDateTime: Date;
  /** text, NOT NULL */
  caption: string;
  /** smallint, NOT NULL */
  activityCategory: number;
  /** boolean, NOT NULL */
  contactNaturalPerson: boolean;
  /** boolean, NOT NULL */
  contactOptIn: boolean;
  /** boolean, NOT NULL */
  contactAllowUsePersonnalDatas: boolean;
  // Champs NULLABLE
  /** text, NULLABLE */
  contactExternalIdGoogleId?: string;
  /** text, NULLABLE */
  contactExternalIdOutlookId?: string;
  /** text, NULLABLE */
  customerId?: string;
  /** text, NULLABLE */
  customerName?: string;
  /** text, NULLABLE */
  supplierId?: string;
  /** text, NULLABLE */
  supplierName?: string;
  /** uuid, NULLABLE */
  contactId?: string;
  /** text, NULLABLE */
  incidentId?: string;
  /** text, NULLABLE */
  maintenanceContractId?: string;
  /** smallint, NULLABLE */
  automaticCreation?: number;
  /** uuid, NULLABLE */
  reminderLetterId?: string;
  /** smallint, NULLABLE */
  documentType?: number;
  /** uuid, NULLABLE */
  saleDocumentId?: string;
  /** uuid, NULLABLE */
  purchaseDocumentId?: string;
  /** uuid, NULLABLE */
  scheduleEventId?: string;
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
  /** uuid, NULLABLE */
  eventType?: string;
  /** text, NULLABLE */
  colleagueId?: string;
  /** text, NULLABLE */
  dealId?: string;
  /** smallint, NULLABLE */
  eventState?: number;
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
  creatorColleagueId?: string;
  /** text, NULLABLE */
  constructionSiteId?: string;
  /** text, NULLABLE */
  contactProfession?: string;
} 