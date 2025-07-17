// colleague.entity.ts
export interface Colleague {
  /** text, NOT NULL */
  id: string;
  /** text, NOT NULL */
  contactName: string;
  /** boolean, NOT NULL */
  isSalesperson: boolean;
  /** smallint, NOT NULL */
  activeState: number;
  /** uuid, NOT NULL */
  uniqueId: string;
  /** numeric, NOT NULL */
  irpfRate: number;
  /** timestamp, NOT NULL */
  daySchedule0StartTime: Date;
  /** timestamp, NOT NULL */
  daySchedule0EndTime: Date;
  /** number (real), NOT NULL */
  daySchedule0Duration: number;
  /** boolean, NOT NULL */
  daySchedule0Active: boolean;
  /** timestamp, NOT NULL */
  daySchedule1StartTime: Date;
  /** timestamp, NOT NULL */
  daySchedule1EndTime: Date;
  /** number (real), NOT NULL */
  daySchedule1Duration: number;
  /** boolean, NOT NULL */
  daySchedule1Active: boolean;
  /** timestamp, NOT NULL */
  daySchedule2StartTime: Date;
  /** timestamp, NOT NULL */
  daySchedule2EndTime: Date;
  /** number (real), NOT NULL */
  daySchedule2Duration: number;
  /** boolean, NOT NULL */
  daySchedule2Active: boolean;
  /** timestamp, NOT NULL */
  daySchedule3StartTime: Date;
  /** timestamp, NOT NULL */
  daySchedule3EndTime: Date;
  /** number (real), NOT NULL */
  daySchedule3Duration: number;
  /** boolean, NOT NULL */
  daySchedule3Active: boolean;
  /** timestamp, NOT NULL */
  daySchedule4StartTime: Date;
  /** timestamp, NOT NULL */
  daySchedule4EndTime: Date;
  /** number (real), NOT NULL */
  daySchedule4Duration: number;
  /** boolean, NOT NULL */
  daySchedule4Active: boolean;
  /** timestamp, NOT NULL */
  daySchedule5StartTime: Date;
  /** timestamp, NOT NULL */
  daySchedule5EndTime: Date;
  /** number (real), NOT NULL */
  daySchedule5Duration: number;
  /** boolean, NOT NULL */
  daySchedule5Active: boolean;
  /** timestamp, NOT NULL */
  daySchedule6StartTime: Date;
  /** timestamp, NOT NULL */
  daySchedule6EndTime: Date;
  /** number (real), NOT NULL */
  daySchedule6Duration: number;
  /** boolean, NOT NULL */
  daySchedule6Active: boolean;
  /** boolean, NOT NULL */
  eventAutomaticAssign: boolean;
  /** numeric, NOT NULL */
  hourlyCostPrice: number;
  /** boolean, NOT NULL */
  daySchedule0Customize: boolean;
  /** boolean, NOT NULL */
  daySchedule1Customize: boolean;
  /** boolean, NOT NULL */
  daySchedule2Customize: boolean;
  /** boolean, NOT NULL */
  daySchedule3Customize: boolean;
  /** boolean, NOT NULL */
  daySchedule4Customize: boolean;
  /** boolean, NOT NULL */
  daySchedule5Customize: boolean;
  /** boolean, NOT NULL */
  daySchedule6Customize: boolean;
  // Champs NULLABLE
  /** text, NULLABLE */
  referenceItemId?: string;
  /** integer, NULLABLE */
  employeePayrollId?: number;
  /** text, NULLABLE */
  emailSignatureClear?: string;
  /** text, NULLABLE */
  emailSignature?: string;
  /** timestamp, NULLABLE */
  daySchedule0LunchStartTime?: Date;
  /** timestamp, NULLABLE */
  daySchedule0LunchEndTime?: Date;
  /** timestamp, NULLABLE */
  daySchedule1LunchStartTime?: Date;
  /** timestamp, NULLABLE */
  daySchedule1LunchEndTime?: Date;
  /** timestamp, NULLABLE */
  daySchedule2LunchStartTime?: Date;
  /** timestamp, NULLABLE */
  daySchedule2LunchEndTime?: Date;
  /** timestamp, NULLABLE */
  daySchedule3LunchStartTime?: Date;
  /** timestamp, NULLABLE */
  daySchedule3LunchEndTime?: Date;
  /** timestamp, NULLABLE */
  daySchedule4LunchStartTime?: Date;
  /** timestamp, NULLABLE */
  daySchedule4LunchEndTime?: Date;
  /** timestamp, NULLABLE */
  daySchedule5LunchStartTime?: Date;
  /** timestamp, NULLABLE */
  daySchedule5LunchEndTime?: Date;
  /** timestamp, NULLABLE */
  daySchedule6LunchStartTime?: Date;
  /** timestamp, NULLABLE */
  daySchedule6LunchEndTime?: Date;
  /** text, NULLABLE */
  documentSerialId?: string;
  /** text, NULLABLE */
  employeeRegistrationNumber?: string;
  /** numeric, NULLABLE */
  salePriceVatExcluded?: number;
  /** text, NULLABLE */
  analyticAccountingGridId?: string;
  /** integer, NULLABLE */
  sysRecordVersion?: number;
  /** uuid, NULLABLE */
  sysRecordVersionId?: string;
  /** integer, NULLABLE */
  sysEditCounter?: number;
  /** text, NULLABLE */
  cifNif?: string;
  /** text, NULLABLE */
  userId?: string;
  /** text, NULLABLE */
  geographicSector?: string;
  /** text, NULLABLE */
  colleagueFamilyId?: string;
  /** uuid, NULLABLE */
  group1?: string;
  /** uuid, NULLABLE */
  group2?: string;
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
  contactColleagueFunction?: string;
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
  /** numeric, NULLABLE */
  addressLongitude?: number;
  /** numeric, NULLABLE */
  addressLatitude?: number;
  /** text, NULLABLE */
  contactCivility?: string;
  /** numeric, NULLABLE */
  maximumDiscountRateAllowed?: number;
  /** uuid, NULLABLE */
  storehouseId?: string;
} 