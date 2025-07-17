// attachmentfile.entity.ts
export interface AttachmentFile {
  /** timestamp, NULLABLE */
  sysCreatedDate?: Date;
  /** text, NULLABLE */
  sysCreatedUser?: string;
  /** timestamp, NULLABLE */
  sysModifiedDate?: Date;
  /** text, NULLABLE */
  sysModifiedUser?: string;
  /** uuid, NOT NULL */
  id: string;
  /** integer, NOT NULL */
  parentId: number;
  /** text, NOT NULL */
  name: string;
  /** Uint8Array, NULLABLE */
  content?: Uint8Array;
  /** smallint, NOT NULL */
  documentType: number;
  /** text, NULLABLE */
  oneDriveShareUrl?: string;
  /** text, NULLABLE */
  oneDriveItemId?: string;
  /** text, NULLABLE */
  oneDriveCode?: string;
  /** smallint, NOT NULL */
  attachmentType: number;
  /** integer, NULLABLE */
  sysEditCounter?: number;
  /** text, NULLABLE */
  typeMime?: string;
  /** smallint, NOT NULL */
  storageType: number;
} 