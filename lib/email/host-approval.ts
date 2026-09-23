import { Resend } from "resend";
import { getAppUrl } from "@/lib/config/app-url";
import { visitorPhotoUrlForEmail } from "@/lib/visitors/photos";

type HostApprovalEmailInput = {
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

function resolveRecipient(hostEmail: string) {
  if (process.env.RESEND_TEST_TO) {
    return process.env.RESEND_TEST_TO;
  }
  return hostEmail;
}

function buildHostApprovalHtml(input: HostApprovalEmailInput) {
  const base = getAppUrl();
  const approveUrl = `${base}/host/approve/${input.approvalToken}`;
  const denyUrl = `${base}/host/deny/${input.approvalToken}`;

  const visitorName = escapeHtml(input.visitorName);
  const hostName = escapeHtml(input.hostName);
  const visitorEmail = escapeHtml(input.visitorEmail);
  const visitorPhone = escapeHtml(input.visitorPhone);
  const purpose = escapeHtml(input.purpose);
  const company = input.company ? escapeHtml(input.company) : null;

  const photoSrc = input.photoUrl
    ? escapeHtml(visitorPhotoUrlForEmail(input.photoUrl))
    : null;

  const companyRow = company
    ? `<tr><td style="padding:10px 0;color:#64748b;font-size:14px">Company</td><td style="padding:10px 0;font-size:15px;color:#0f172a">${company}</td></tr>`
    : "";

  const photoColumn = photoSrc
    ? `<td style="width:180px;vertical-align:top;padding-right:24px">
        <img src="${photoSrc}" alt="Visitor photo" width="180" height="180" style="display:block;width:180px;height:180px;object-fit:cover;border-radius:12px;border:1px solid #e2e8f0" />
      </td>`
    : "";

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto">
    <tr>
      <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:28px">
        <p style="margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#64748b">Visitor management</p>
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0f172a;line-height:1.25">Approval needed</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#475569">Hi ${hostName}, a visitor at the front desk is waiting to see you.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px">
          <tr>
            ${photoColumn}
            <td style="vertical-align:top">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                <tr><td style="padding:10px 0;color:#64748b;font-size:14px;width:100px">Visitor</td><td style="padding:10px 0;font-size:15px;font-weight:600;color:#0f172a">${visitorName}</td></tr>
                <tr><td style="padding:10px 0;color:#64748b;font-size:14px">Email</td><td style="padding:10px 0;font-size:15px;color:#0f172a">${visitorEmail}</td></tr>
                <tr><td style="padding:10px 0;color:#64748b;font-size:14px">Phone</td><td style="padding:10px 0;font-size:15px;color:#0f172a">${visitorPhone}</td></tr>
                ${companyRow}
                <tr><td style="padding:10px 0;color:#64748b;font-size:14px">Purpose</td><td style="padding:10px 0;font-size:15px;color:#0f172a">${purpose}</td></tr>
                <tr><td style="padding:10px 0;color:#64748b;font-size:14px">Time</td><td style="padding:10px 0;font-size:15px;color:#0f172a">${escapeHtml(formatWhen(input.requestedAt))}</td></tr>
              </table>
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:12px">
              <a href="${approveUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:600">Approve visit</a>
            </td>
            <td>
              <a href="${denyUrl}" style="display:inline-block;background:#ffffff;color:#0f172a;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:600;border:1px solid #cbd5e1">Deny visit</a>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#94a3b8">You will confirm your choice once on the website before the visit status updates.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendHostApprovalEmail(input: HostApprovalEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn("[email] Skipped — set RESEND_API_KEY and EMAIL_FROM in .env");
    return { skipped: true };
  }

  const to = resolveRecipient(input.hostEmail);
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: `Visitor at desk: ${input.visitorName}`,
    html: buildHostApprovalHtml(input),
  });

  if (error) {
    console.error("[email] Resend error:", error);
    return { error: error.message };
  }

  return { sent: true, id: data?.id, to };
}
