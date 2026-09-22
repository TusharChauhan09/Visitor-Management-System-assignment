export type HostVisitSummaryProps = {
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  company: string | null;
  purpose: string;
  photoUrl: string | null;
  hostName: string;
  department: string;
};

export type CheckInResult =
  | { visitId: string }
  | { error: string };
