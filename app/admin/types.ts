export type Request = {
  id: string; created_at: string; email: string; description: string;
  competencies: string[]; status: string; duration: string; work_mode: string;
  start_date: string; admin_note?: string; admin_status?: string;
};

export type Submission = {
  id: string; created_at: string; request_id: string; name: string; title: string;
  rate: number; skills: string[]; bio: string; availability: string; status: string;
  customer_decision: string | null; interview_datetime: string | null;
  interview_confirmed: boolean; cv_url: string | null;
  requests: { description: string; email: string } | null;
  ai_rating: number | null; ai_summary: string | null;
};

export type Supplier = { id: string; email: string; company_name: string };

export type User = {
  id: string; email: string; created_at: string; rolle: string;
  company_name: string; contact_name: string; phone: string; supplier_company: string;
  first_name: string | null; last_name: string | null; company_type: string | null;
};

export type Contract = {
  id: string; created_at: string; request_id: string; supplier_id: string;
  consultant_name: string; rate: number; duration: string; start_date: string;
  score: number | null; score_comment: string | null;
  requests: { description: string; email: string } | null;
  suppliers: { company_name: string; email: string } | null;
};

export type SupplierApplication = {
  id: string; created_at: string; company_name: string; first_name: string;
  last_name: string; email: string; phone: string; company_type: string;
  competencies: string[]; extra_competencies: string; language: string; status: string;
};

export type BadgeCounts = { pending: number; applications: number; messages: number };
