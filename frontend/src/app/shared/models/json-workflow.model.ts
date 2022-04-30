import {JsonWorkflowJob} from './json-workflow-job.model';

export interface JsonWorkflow {
  id: number;
  name: string;
  status: string;
  created_at: Date;
  jobs: JsonWorkflowJob[];
}
