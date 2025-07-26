import { MailtrapClient } from "mailtrap";

// Environment variables
const TOKEN = process.env.MAILTRAP_TOKEN!;
const SENDER_EMAIL = process.env.EMAIL_FROM!;
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL!;

// Initialize Mailtrap client
const client = new MailtrapClient({ token: TOKEN });

// Common email params
type InvoiceEmailParams = {
  recipientName: string;
  recipientEmail: string;
  invoiceNumber: string;
  dueDate: string;
  total: string;
  downloadUrl: string;
};

// Generic email sender
async function sendInvoice({
  subject,
  category,
  introText,
  params,
}: {
  subject: string;
  category: string;
  introText: string;
  params: InvoiceEmailParams;
}) {
  const {
    recipientName,
    recipientEmail,
    invoiceNumber,
    dueDate,
    total,
    downloadUrl,
  } = params;

  const html = generateInvoiceHtml({
    recipientName,
    recipientEmail,
    invoiceNumber,
    dueDate,
    total,
    downloadUrl,
    introText,
  });

  await client.send({
    category,
    from: { name: "Clearbill", email: SENDER_EMAIL },
    to: [{ email: recipientEmail }],
    subject,
    reply_to: { email: REPLY_TO_EMAIL },
    html,
  });
}

// HTML email template
function generateInvoiceHtml({
  recipientName,
  invoiceNumber,
  dueDate,
  total,
  downloadUrl,
  introText,
}: InvoiceEmailParams & { introText: string }) {
  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice Email</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f7; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

      <table width="100%" height="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
              <tr>
                <td style="background-color:#007BFF; padding:20px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:24px;">Clearbill</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:30px;">
                  <p style="font-size:16px; color:#333333;">Hi <strong>${recipientName}</strong>,</p>
                  <p style="font-size:16px; color:#333333; line-height:1.6;">${introText}</p>

                  <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:20px; margin-bottom:20px;">
                    <tr>
                      <td style="font-size:16px; padding:8px 0;"><strong>Invoice Number:</strong></td>
                      <td style="font-size:16px; padding:8px 0;">${invoiceNumber}</td>
                    </tr>
                    <tr>
                      <td style="font-size:16px; padding:8px 0;"><strong>Due Date:</strong></td>
                      <td style="font-size:16px; padding:8px 0;">${dueDate}</td>
                    </tr>
                    <tr>
                      <td style="font-size:16px; padding:8px 0;"><strong>Total Amount:</strong></td>
                      <td style="font-size:16px; padding:8px 0;">${total}</td>
                    </tr>
                  </table>

                  <div style="text-align:center; margin-top:30px;">
                    <a href="${downloadUrl}" style="background-color:#007BFF; color:#ffffff; text-decoration:none; padding:12px 24px; font-size:16px; border-radius:6px; display:inline-block;">Download Invoice</a>
                  </div>

                  <p style="font-size:14px; color:#999999; margin-top:40px;">If you have any questions, just reply to this email — we're happy to help.</p>
                </td>
              </tr>

              <tr>
                <td style="background-color:#f0f0f0; text-align:center; padding:20px;">
                  <p style="font-size:12px; color:#888888; margin:0;">
                    © ${new Date().getFullYear()} Clearbill, Inc. All rights reserved.<br>
                    123 Clearbill Lane, Invoice City, IN 12345
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

    </body>
  </html>
  `;
}

// === Specific Email Types ===

export async function sendInvoiceEmail(params: InvoiceEmailParams) {
  return sendInvoice({
    subject: "Your Invoice is Ready",
    category: "Invoice",
    introText: "Please find your invoice details below.",
    params,
  });
}

export async function sendInvoiceUpdateEmail(params: InvoiceEmailParams) {
  return sendInvoice({
    subject: "Your Invoice Has Been Updated",
    category: "Invoice Update",
    introText: "Your updated invoice details are below.",
    params,
  });
}

export async function sendReminderEmail(params: InvoiceEmailParams) {
  return sendInvoice({
    subject: "Friendly Payment Reminder",
    category: "Invoice Reminder",
    introText:
      "This is a reminder for a pending invoice. Please review the details below.",
    params,
  });
}
