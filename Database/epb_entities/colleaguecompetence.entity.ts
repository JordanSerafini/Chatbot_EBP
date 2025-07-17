// colleaguecompetence.entity.ts
export interface ColleagueCompetence {
  /** uuid, NOT NULL */
  id: string;
  /** text, NOT NULL */
  colleagueId: string;
  /** text, NOT NULL */
  competenceId: string;
  /** integer, NOT NULL */
  threshold: number;
  /** integer, NOT NULL */
  competenceOrder: number;
  /** timestamp, NULLABLE */
  startDate?: Date;
  /** timestamp, NULLABLE */
  endDate?: Date;
  /** timestamp, NULLABLE */
  alertDate?: Date;
  /** integer, NULLABLE */
  comptetenceValidityDuration?: number;
} 