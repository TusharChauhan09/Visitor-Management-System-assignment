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
