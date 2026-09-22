import { Resend } from "resend";
import { getAppUrl } from "@/lib/config/app-url";
import type { HostApprovalEmailInput } from "@/lib/types/email";

function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

function buildHostApprovalHtml(input: HostApprovalEmailInput) {
  const base = getAppUrl();
  const approveUrl = `${base}/host/approve/${input.approvalToken}`;
  const denyUrl = `${base}/host/deny/${input.approvalToken}`;

  const companyRow = input.company
    ? `<tr><td style="padding:8px 0;color:#666">Company</td><td style="padding:8px 0">${input.company}</td></tr>`
    : "";

  const photoBlock = input.photoUrl
    ? `<p style="margin:16px 0"><img src="${input.photoUrl}" alt="Visitor photo" width="200" style="border-radius:8px;max-width:100%" /></p>`
    : "";

  return `
    <div style="font-family:system-ui,sans-serif;max-width:520px;color:#111">
      <p style="font-size:14px;color:#666">Visitor Management</p>
      <h1 style="font-size:22px;margin:0 0 8px">Visitor waiting for approval</h1>
      <p style="color:#444;line-height:1.5">Hi ${input.hostName}, someone is at the desk to see you.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:15px">
        <tr><td style="padding:8px 0;color:#666;width:120px">Name</td><td style="padding:8px 0"><strong>${input.visitorName}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0">${input.visitorEmail}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${input.visitorPhone}</td></tr>
        ${companyRow}
        <tr><td style="padding:8px 0;color:#666">Purpose</td><td style="padding:8px 0">${input.purpose}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Requested</td><td style="padding:8px 0">${formatWhen(input.requestedAt)}</td></tr>
      </table>
      ${photoBlock}
      <p style="margin:24px 0 12px;font-size:14px;color:#444">Choose an action:</p>
      <p style="margin:0 0 24px">
        <a href="${approveUrl}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;margin-right:12px">Approve</a>
        <a href="${denyUrl}" style="display:inline-block;background:#fff;color:#111;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;border:1px solid #ccc">Deny</a>
      </p>
      <p style="font-size:12px;color:#888;line-height:1.5">You will confirm once more on the website before the visit status changes.</p>
    </div>
  `;
}

export async function sendHostApprovalEmail(input: HostApprovalEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn(
      "[email] Skipped host notification — set RESEND_API_KEY and EMAIL_FROM in .env"
    );
    return { skipped: true };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: input.hostEmail,
    subject: `Visitor request: ${input.visitorName}`,
    html: buildHostApprovalHtml(input),
  });

  if (error) {
    console.error("[email] Resend error:", error);
    return { error: error.message };
  }

  return { sent: true };
}
