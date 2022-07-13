import {IntakeSource} from './intake-source.model';

export interface IntakeCatalog {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  sources: IntakeSource[];
}
