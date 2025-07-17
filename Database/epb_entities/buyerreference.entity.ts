// buyerreference.entity.ts
export interface BuyerReference {
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
  /** text, NOT NULL */
  code: string;
  /** text, NOT NULL */
  caption: string;
  /** text, NOT NULL */
  siret: string;
  /** boolean, NOT NULL */
  legalCommitment: boolean;
} 