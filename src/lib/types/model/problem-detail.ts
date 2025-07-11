export type ProblemDetail = {
  type?: string;          // A URI reference that identifies the problem type
  title?: string;         // Short, human-readable summary of the problem type
  status?: number;        // HTTP status code
  detail?: string;        // Human-readable explanation
  instance?: string;      // URI reference identifying the specific occurrence
  [key: string]: any;     // Extension members (custom fields)
}