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

export type EmployeeVisitRow = {
  id: string;
  status: string;
  purpose: string;
  preApproved: boolean;
  windowStart: Date | null;
  windowEnd: Date | null;
  checkInAt: Date | null;
  visitor: {
    fullName: string;
    email: string;
    phone: string;
    company: string | null;
  };
  visitedBefore: boolean;
};
