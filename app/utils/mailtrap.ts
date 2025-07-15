import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_TOKEN!;
const SENDER_EMAIL = process.env.EMAIL_FROM!;
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL!;

const client = new MailtrapClient({ token: TOKEN });

export async function sendInvoiceEmail({
  recipientName,
  recipientEmail,
  invoiceNumber,
  dueDate,
  total,
  downloadUrl,
}: {
  recipientName: string;
  recipientEmail: string;
  invoiceNumber: string;
  dueDate: string;
  total: string;
  downloadUrl: string;
}) {
  await client.send({
    category: "invoice",
    from: { name: "Clearbill", email: SENDER_EMAIL },
    to: [{ email: recipientEmail }],
    subject: "Your Invoice is Ready",
    reply_to: { email: REPLY_TO_EMAIL },
    html: `
      <!doctype html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
            <p>Dear ${recipientName},</p>
            <p>I hope this email finds you well. Please find your invoice details below:</p>

            <h3>Invoice Details:</h3>
            <ul>
              <li><strong>Invoice Number:</strong> ${invoiceNumber}</li>
              <li><strong>Due Date:</strong> ${dueDate}</li>
              <li><strong>Total Amount:</strong> ${total}</li>
            </ul>

            <p>You can download your invoice by clicking the button below:</p>

            <a href="${downloadUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Download Invoice</a>

            <br><br>
            
          </div>
        </body>
      </html>
    `,
  });
}
