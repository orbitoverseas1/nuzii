import "server-only";
import { getResendClient } from "./resend";

export interface OrderEmailLine {
  name: string;
  variantLabel?: string;
  quantity: number;
  lineTotal: number;
}

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode?: string;
    country: string;
  };
  shippingMethod: { title: string; cost: number };
  lines: OrderEmailLine[];
  subtotal: number;
  amountDiscount: number;
  shippingCost: number;
  totalPrice: number;
  currency: string;
}

const money = (amount: number, currency: string) =>
  `${currency.toUpperCase()} ${Math.round(amount).toLocaleString("en-US")}`;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const lineRows = (data: OrderEmailData) =>
  data.lines
    .map((line) => {
      const label = line.variantLabel
        ? `${escapeHtml(line.name)} <span style="color:#888;">(${escapeHtml(
            line.variantLabel
          )})</span>`
        : escapeHtml(line.name);
      return `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">
            ${label} <span style="color:#888;">× ${line.quantity}</span>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">
            ${money(line.lineTotal, data.currency)}
          </td>
        </tr>`;
    })
    .join("");

const totalsRows = (data: OrderEmailData) => `
  <tr>
    <td style="padding:6px 0;">Subtotal</td>
    <td style="padding:6px 0;text-align:right;">${money(
      data.subtotal,
      data.currency
    )}</td>
  </tr>
  ${
    data.amountDiscount > 0
      ? `<tr>
          <td style="padding:6px 0;color:#0a7a3f;">Discount</td>
          <td style="padding:6px 0;text-align:right;color:#0a7a3f;">− ${money(
            data.amountDiscount,
            data.currency
          )}</td>
        </tr>`
      : ""
  }
  <tr>
    <td style="padding:6px 0;">Shipping (${escapeHtml(
      data.shippingMethod.title
    )})</td>
    <td style="padding:6px 0;text-align:right;">${money(
      data.shippingCost,
      data.currency
    )}</td>
  </tr>
  <tr>
    <td style="padding:10px 0 0;border-top:2px solid #111;font-weight:700;">Total</td>
    <td style="padding:10px 0 0;border-top:2px solid #111;font-weight:700;text-align:right;">${money(
      data.totalPrice,
      data.currency
    )}</td>
  </tr>`;

const addressBlock = (data: OrderEmailData) => {
  const a = data.shippingAddress;
  const parts = [
    a.line1,
    a.line2,
    [a.city, a.postalCode].filter(Boolean).join(" "),
    a.country,
  ].filter(Boolean);
  return parts.map((p) => escapeHtml(p as string)).join("<br/>");
};

const shell = (heading: string, intro: string, body: string) => `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px;margin:0 auto;padding:24px;">
    <h1 style="font-size:22px;margin:0 0 4px;">NUZII</h1>
    <h2 style="font-size:18px;margin:16px 0 8px;">${heading}</h2>
    <p style="color:#444;line-height:1.5;margin:0 0 20px;">${intro}</p>
    ${body}
    <p style="color:#999;font-size:12px;margin-top:28px;">This is an automated message from the NUZII store.</p>
  </div>`;

const orderTableBlock = (data: OrderEmailData) => `
  <div style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:16px 18px;margin-bottom:20px;">
    <p style="margin:0 0 12px;font-size:13px;color:#666;">
      Order Number: <strong style="color:#111;">${escapeHtml(
        data.orderNumber
      )}</strong>
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${lineRows(data)}
      ${totalsRows(data)}
    </table>
  </div>
  <div style="font-size:14px;color:#333;line-height:1.5;">
    <p style="margin:0 0 4px;font-weight:600;">Shipping to</p>
    <p style="margin:0 0 16px;color:#555;">${addressBlock(data)}</p>
  </div>`;

const customerHtml = (data: OrderEmailData) =>
  shell(
    "Order Placed!",
    `Hi ${escapeHtml(
      data.customerName
    )}, thanks for your order. We'll contact you shortly to confirm the details and arrange payment on delivery.`,
    orderTableBlock(data)
  );

const adminHtml = (data: OrderEmailData) =>
  shell(
    "New order received",
    `A new order was placed by ${escapeHtml(data.customerName)}. Open Sanity Studio to review and fulfil it.`,
    `
    ${orderTableBlock(data)}
    <div style="font-size:14px;color:#333;line-height:1.6;">
      <p style="margin:0 0 4px;font-weight:600;">Customer</p>
      <p style="margin:0 0 16px;color:#555;">
        ${escapeHtml(data.customerName)}<br/>
        ${escapeHtml(data.email)}<br/>
        ${escapeHtml(data.phone)}
      </p>
    </div>`
  );

export const sendCustomerOrderEmail = async (data: OrderEmailData) => {
  const resend = getResendClient();
  const from = process.env.EMAIL_FROM;
  if (!resend || !from) {
    if (!from) console.warn("[resend] EMAIL_FROM is not set — skipping customer email.");
    return;
  }
  await resend.emails.send({
    from,
    to: data.email,
    subject: `Your NUZII order ${data.orderNumber}`,
    html: customerHtml(data),
  });
};

export const sendAdminOrderEmail = async (data: OrderEmailData) => {
  const resend = getResendClient();
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_ADMIN_TO;
  if (!resend || !from || !to) {
    if (!to) console.warn("[resend] EMAIL_ADMIN_TO is not set — skipping admin email.");
    return;
  }
  await resend.emails.send({
    from,
    to,
    subject: `New order ${data.orderNumber} — ${data.customerName}`,
    html: adminHtml(data),
  });
};
