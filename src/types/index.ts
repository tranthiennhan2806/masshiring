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
  imageUrl?: string; // <-- Thêm dòng này
  status: "active" | "closed";
  createdAt: string;
}

export interface JobFormInput {
  title: string;
  salary: string;
  location: string;
  type: string;
  quantity: number;
  deadline: string;
  industry: string;
  description: string;
  imageUrl?: string; // <-- Thêm dòng này
  status?: "active" | "closed";
}

export interface Post {
  id: string; // Dùng slug làm id
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
  date: string; // VD: 12/2026 hoặc ISO string
  status: "published" | "draft";
  createdAt: string;
}

export interface PostFormInput {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
  date: string;
  status: "published" | "draft";
}