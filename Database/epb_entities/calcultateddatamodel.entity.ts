// calcultateddatamodel.entity.ts
export interface CalcultatedDataModel {
  /** uuid, NOT NULL */
  id: string;
  /** text, NOT NULL */
  caption: string;
  /** smallint, NOT NULL */
  purpose: number;
  /** text, NULLABLE */
  programProgram?: string;
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
  /** integer, NULLABLE */
  sysEditCounter?: number;
} 