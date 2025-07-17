// deal.entity.ts
export interface Deal {
  /** boolean, NOT NULL */
  xxNc: boolean;
  /** numeric, NOT NULL */
  predictedCosts: number;
  /** numeric, NOT NULL */
  predictedSales: number;
  /** numeric, NOT NULL */
  predictedGrossMargin: number;
  /** numeric, NOT NULL */
  accomplishedCosts: number;
  /** numeric, NOT NULL */
  accomplishedSales: number;
  /** numeric, NOT NULL */
  accomplishedGrossMargin: number;
  /** numeric, NOT NULL */
  profitsOnCosts: number;
  /** numeric, NOT NULL */
  profitsOnSales: number;
  /** numeric, NOT NULL */
  profitsOnGrossMargin: number;
  /** text, NOT NULL */
  id: string;
  /** text, NOT NULL */
  caption: string;
  /** timestamp, NOT NULL */
  dealDate: Date;
  /** boolean, NOT NULL */
  invoiceScheduleEvent: boolean;
  /** boolean, NOT NULL */
  invoiceScheduleTimeEvent: boolean;
  /** numeric, NOT NULL */
  predictedDuration: number;
  /** numeric, NOT NULL */
  accomplishedDuration: number;
  /** numeric, NOT NULL */
  profitsOnDuration: number;
  /** numeric, NOT NULL */
  actualTreasury: number;
  /** numeric, NOT NULL */
  customerCommitmentBalanceDues: number;
  /** numeric, NOT NULL */
  supplierCommitmentBalanceDues: number;
  /** numeric, NOT NULL */
  subContractorCommitmentBalanceDues: number;
  /** numeric, NOT NULL */
  otherCosts: number;
  /** numeric, NOT NULL */
  treasuryBalanceDue: number;
  // Champs NULLABLE
  /** timestamp, NULLABLE */
  xxDateDebut?: Date;
  /** timestamp, NULLABLE */
  xxDateFin?: Date;
  /** text, NULLABLE */
  xxGestionProjetPosit?: string;
  /** numeric, NULLABLE */
  xxDureePrevue?: number;
  /** integer, NULLABLE */
  dealState?: number;
  /** text, NULLABLE */
  analyticAccountingGridId?: string;
  /** integer, NULLABLE */
  sysEditCounter?: number;
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
  xxClient?: string;
  /** numeric, NULLABLE */
  xxTotalTempsRealise?: number;
  /** numeric, NULLABLE */
  xxTotalTempsRealiseClient?: number;
  /** numeric, NULLABLE */
  xxTotalTempsRealiseInterne?: number;
  /** text, NULLABLE */
  xxService?: string;
  /** numeric, NULLABLE */
  xxTotalTempsRealiseRelationnel?: number;
  /** timestamp, NULLABLE */
  xxDateFinReelle?: Date;
  /** numeric, NULLABLE */
  xxTotalTempsRealiseProjet?: number;
  /** numeric, NULLABLE */
  xxDureeTrajet?: number;
  /** numeric, NULLABLE */
  xxTotalTempsRealiseTrajet?: number;
  /** text, NULLABLE */
  xxCommercial?: string;
  /** numeric, NULLABLE */
  xxTotalTempsRealiseFormation?: number;
  /** numeric, NULLABLE */
  xxTotalTempsRealiseMaquettage?: number;
  /** timestamp, NULLABLE */
  xxDateFicheTravail?: Date;
  /** text, NULLABLE */
  xxOrigineVente?: string;
  /** timestamp, NULLABLE */
  xxDateRapport?: Date;
} 