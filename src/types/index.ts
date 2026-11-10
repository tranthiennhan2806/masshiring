export type LeadType = "doanh-nghiep" | "doi-tac" | "hr-freelancer" | "ung-vien" | "lien-he";

export interface Job {
  id: string;
  title: string;
  salary: string;
  location: string;
  type: string; // fulltime, parttime, shift
  quantity: number;
  deadline: string;
  industry: string;
  description: string;
  status: "active" | "closed";
  createdAt: string;
}

/**
 * Dùng cho form đăng / sửa job (admin).
 * - Không có `id` và `createdAt` vì server tự sinh.
 * - `status` optional, mặc định là "active".
 * - `quantity` là number để khớp với `Job`.
 */
export interface JobFormInput {
  title: string;
  salary: string;
  location: string;
  type: string;
  quantity: number;
  deadline: string;
  industry: string;
  description: string;
  status?: "active" | "closed";
}

export interface ApplicantForm {
  fullName: string;
  phone: string;
  birthYear?: string;
  area: string;
  hrCode?: string;
  jobId?: string;
  jobTitle?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  page?: string;
}

export interface BusinessLeadForm {
  fullName: string;
  company: string;
  phone: string;
  position: string;
  area: string;
  email?: string;
  quantity?: string;
  note?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface PartnerLeadForm {
  fullName: string;
  company: string;
  phone: string;
  position: string;
  area: string;
  email?: string;
  quantity?: string;
  note?: string;
}

export interface HRFreelancerForm {
  fullName: string;
  phone: string;
  province: string;
  email?: string;
  experience?: string;
  facebook?: string;
  availableTime?: string;
}