// colleaguewebsynchronizationinfo.entity.ts
export interface ColleagueWebSynchronizationInfo {
  /** uuid, NOT NULL */
  id: string;
  /** text, NOT NULL */
  parentId: string;
  /** text, NOT NULL */
  infoKey: string;
  /** text, NULLABLE */
  infoValue?: string;
  /** timestamp, NULLABLE */
  sysCreatedDate?: Date;
  /** text, NULLABLE */
  sysCreatedUser?: string;
  /** timestamp, NULLABLE */
  sysModifiedDate?: Date;
  /** text, NULLABLE */
  sysModifiedUser?: string;
} 