export type ActionState = {
  error?: string;
};

export type EmployeeOption = {
  id: string;
  fullName: string;
  department: string;
};

export type HostApprovalEmailInput = {
  hostEmail: string;
  hostName: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  company: string | null;
  purpose: string;
  photoUrl: string | null;
  requestedAt: Date;
  approvalToken: string;
};

export type VisitLogEntry = {
  id: string;
  status: string;
  purpose: string;
  preApproved: boolean;
  photoUrl: string | null;
  windowStart: string | null;
  windowEnd: string | null;
  checkInAt: string | null;
  checkOutAt: string | null;
  createdAt: string;
  visitor: {
    fullName: string;
    email: string;
    phone: string;
    company: string | null;
  };
  host: {
    fullName: string;
    email: string;
    department: string;
    phone: string;
  };
};

export type PendingEmployeeEntry = {
  id: string;
  fullName: string;
  email: string;
  department: string;
  phone: string;
};

export type AdminEmployeeEntry = {
  id: string;
  fullName: string;
  email: string;
  department: string;
  phone: string;
  isApproved: boolean;
  maxVisitorsPerDay: number;
  totalVisits: number;
  pendingVisits: number;
  checkedInVisits: number;
};
