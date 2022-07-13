import {IntakeSourceCreate} from './intake-source.create.model';

export interface IntakeCatalogCreate {
  id: number;
  name: string;
  sources: IntakeSourceCreate[];
}
