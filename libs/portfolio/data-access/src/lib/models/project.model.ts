export interface Project {
  id: number;
  name: string;
  status: string;
  owner: string;
  riskLevel: string;
  budget: number | null;
  startDate: string | null;
  endDate: string | null;
}
