// colleagueassociatedfiles.entity.ts
export interface ColleagueAssociatedFiles {
  /** uuid, NOT NULL */
  id: string;
  /** text, NOT NULL */
  parentId: string;
  /** text, NOT NULL */
  name: string;
  /** smallint, NOT NULL */
  documentType: number;
  /** integer, NULLABLE */
  sysEditCounter?: number;
  /** Uint8Array, NULLABLE */
  content?: Uint8Array;
  /** timestamp, NULLABLE */
  sysCreatedDate?: Date;
  /** text, NULLABLE */
  sysCreatedUser?: string;
  /** timestamp, NULLABLE */
  sysModifiedDate?: Date;
  /** text, NULLABLE */
  sysModifiedUser?: string;
  /** text, NULLABLE */
  oneDriveShareUrl?: string;
  /** text, NULLABLE */
  oneDriveItemId?: string;
  /** text, NULLABLE */
  oneDriveCode?: string;
  /** text, NULLABLE */
  typeMime?: string;
  /** smallint, NOT NULL */
  storageType: number;
} 