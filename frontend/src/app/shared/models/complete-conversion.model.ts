import {CompleteConversionJob} from './complete-conversion-job.model';

export interface CompleteConversion {
  id: number;
  name: string;
  status: string;
  created_at: Date;
  jobs: CompleteConversionJob[];
}
