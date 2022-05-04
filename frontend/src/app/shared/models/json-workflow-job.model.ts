export interface JsonWorkflowJob {
  id: number;
  job_id: string;
  file_name: string;
  input: string;
  output: string;
  status: string;
  exception: string;
  created_at: Date;
}
