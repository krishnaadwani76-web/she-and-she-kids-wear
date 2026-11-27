/**
 * Order Notification & Courier Dispatch Helpers
 * Handles:
 * 1. Instant WhatsApp Order Confirmation (Customer -> Store Owner)
 * 2. WhatsApp Shipment & Tracking Updates (Store Owner -> Customer)
 * 3. Formatted Shipping Label for Courier Booking (Delhivery, Shiprocket, DTDC, India Post)
 * 4. Printable Packing Slip & Tax Invoice Generator
 * 5. Webhook / Email Notification Dispatcher
 */

import { formatCurrency, formatDate } from "./formatters.js";

/**
 * Generate WhatsApp URL for customer to send complete order confirmation to the store owner
 */
export function generateStoreWhatsAppOrderUrl(order, storeWhatsappNumber = "918824844263") {
  if (!order || !order.customer) return "";

  const cleanPhone = (storeWhatsappNumber || "918824844263").replace(/\D/g, "");
  
  const itemsText = (order.items || [])
    .map((item, idx) => `  ${idx + 1}. *${item.name}* (Size: ${item.size || 'Free'}, Color: ${item.color || 'Standard'}) × ${item.quantity} = ₹${item.price * item.quantity}`)
    .join("\n");

  const message = 
`🛍️ *NEW ORDER ON SHE & SHE KIDS WEAR*
---------------------------------------
📋 *Order ID:* ${order.id}
📅 *Date & Time:* ${formatDate(order.createdAt)}

👤 *CUSTOMER DETAILS:*
• *Name:* ${order.customer.name}
• *Mobile:* ${order.customer.phone}
• *Email:* ${order.customer.email || 'Not provided'}

📍 *DELIVERY DESTINATION:*
${order.customer.address}
${order.customer.city || 'Kota'}, ${order.customer.state || 'Rajasthan'} - ${order.customer.pincode}

📦 *ITEMS ORDERED (${(order.items || []).length}):*
${itemsText}

💰 *BILLING SUMMARY:*
• Subtotal: ${formatCurrency(order.subtotal || order.total)}
• Discount: ${formatCurrency(order.discount || 0)}
• Shipping: ${formatCurrency(order.shipping || 0)}
• *Grand Total:* ${formatCurrency(order.total)}

💳 *PAYMENT METHOD:*
• Mode: ${order.paymentMethod || 'Cash on Delivery'}
• Status: *${order.paymentStatus || 'Pending on Delivery'}*
---------------------------------------
Please confirm my order and arrange delivery. Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate WhatsApp URL for store owner to notify customer about shipment & tracking
 */
export function generateCustomerTrackingWhatsAppUrl(order, storeInfo) {
  if (!order || !order.customer || !order.customer.phone) return "";

  let cleanPhone = order.customer.phone.replace(/\D/g, "");
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;
  }

  const storeName = (storeInfo && storeInfo.name) || "She & She Kids Wear";
  const courier = order.courier || "Courier Partner";
  const trackingNumber = order.trackingNumber || "Assigned on Dispatch";
  const trackingLink = order.trackingLink ? `\n🔗 *Track Live:* ${order.trackingLink}` : "";

  const message =
`Namaste *${order.customer.name}*! 🙏

Exciting news! Your kidswear order from *${storeName}*, Dadabari Kota has been packed with love and dispatched for delivery. 🎀✨

📦 *ORDER & SHIPMENT DETAILS:*
• *Order ID:* ${order.id}
• *Status:* ${order.orderStatus || 'Shipped'}
• *Courier Partner:* ${courier}
• *Tracking / AWB No.:* ${trackingNumber}${trackingLink}

📍 *Delivery Address:*
${order.customer.address}, ${order.customer.city || 'Kota'} - ${order.customer.pincode}

💰 *Amount to Pay:* ${order.paymentStatus && order.paymentStatus.includes("Paid") ? "ALREADY PAID (Prepaid)" : `${formatCurrency(order.total)} (Cash on Delivery)`}

If you have any questions regarding your parcel, reply directly to this message or call our Dadabari store at +91 88248 44263.

Thank you for shopping with ${storeName}! ✨`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate formatted text block for copy-pasting into courier booking portals (Shiprocket, Delhivery, DTDC, etc.)
 */
export function generateShippingLabelText(order, storeInfo) {
  if (!order || !order.customer) return "";

  const storeAddress = (storeInfo && storeInfo.address) || "Sethiya Complex, Dadabari, Kota, Rajasthan - 324009";
  const storePhone = (storeInfo && storeInfo.phone) || "+91 88248 44263";

  return `========================================
SHIP TO (CUSTOMER DELIVERY ADDRESS):
----------------------------------------
Name:     ${order.customer.name}
Mobile:   ${order.customer.phone}
Email:    ${order.customer.email || 'N/A'}
Address:  ${order.customer.address}
City:     ${order.customer.city || 'Kota'}
State:    ${order.customer.state || 'Rajasthan'}
PIN Code: ${order.customer.pincode}

ORDER REFERENCE:
Order ID:       ${order.id}
Date:           ${formatDate(order.createdAt)}
Total Amount:   ${formatCurrency(order.total)}
Payment Mode:   ${order.paymentMethod}
Collect on COD: ${order.paymentStatus && order.paymentStatus.includes("Paid") ? "NIL (Already Paid)" : `INR ${order.total}`}

PARCEL CONTENTS:
${(order.items || []).map((i, idx) => `${idx + 1}. ${i.name} (Size: ${i.size || 'Free'}, Qty: ${i.quantity})`).join("\n")}

SHIP FROM (SENDER):
She & She Kids Wear
${storeAddress}
Phone: ${storePhone}
========================================`;
}

/**
 * Generate and open a printable Invoice / Packing Slip
 */
export function printOrderInvoice(order, storeInfo) {
  if (!order) return;

  const storeName = (storeInfo && storeInfo.name) || "She & She Kids Wear";
  const storeAddress = (storeInfo && storeInfo.address) || "Sethiya Complex, Dadabari, Kota, Rajasthan - 324009";
  const storePhone = (storeInfo && storeInfo.phone) || "+91 88248 44263";
  const storeEmail = (storeInfo && storeInfo.email) || "care@sheandshekidswear.com";

  const printWindow = window.open("", "_blank", "width=850,height=900");
  if (!printWindow) {
    alert("Please allow popups to print the invoice.");
    return;
  }

  const itemsRows = (order.items || []).map((item, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 12px; font-weight: bold;">${idx + 1}</td>
      <td style="padding: 10px 12px;">
        <div style="font-weight: bold; color: #0f172a;">${item.name}</div>
        <div style="font-size: 11px; color: #64748b;">Size: <strong>${item.size || 'Free'}</strong> | Colour: ${item.color || 'Standard'}</div>
      </td>
      <td style="padding: 10px 12px; text-align: center; font-weight: bold;">${item.quantity}</td>
      <td style="padding: 10px 12px; text-align: right;">${formatCurrency(item.price)}</td>
      <td style="padding: 10px 12px; text-align: right; font-weight: bold;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Invoice - ${order.id} | ${storeName}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 32px; color: #1e293b; font-size: 13px; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #f43f5e; margin-bottom: 24px; }
        .logo-box { display: flex; align-items: center; gap: 12px; }
        .logo-badge { background: #e11d48; color: white; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; font-family: Georgia, serif; }
        .store-title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; }
        .store-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
        .invoice-meta { text-align: right; }
        .invoice-title { font-size: 22px; font-weight: 900; color: #e11d48; letter-spacing: 1px; margin: 0; }
        .order-id { font-family: monospace; font-size: 14px; font-weight: bold; color: #0f172a; margin-top: 4px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; }
        .card-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #e11d48; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
        th { background: #f1f5f9; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; }
        .totals-table { width: 280px; margin-left: auto; border-collapse: collapse; font-size: 12px; margin-bottom: 24px; }
        .totals-table td { padding: 6px 12px; }
        .grand-total { font-size: 15px; font-weight: 900; color: #e11d48; border-top: 2px solid #cbd5e1; }
        .footer { text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 11px; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; background: #e0f2fe; color: #0369a1; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="background: #e11d48; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">🖨️ Print Packing Slip / Bill</button>
      </div>

      <div class="header">
        <div class="logo-box">
          <div class="logo-badge">S&S</div>
          <div>
            <h1 class="store-title">${storeName}</h1>
            <div class="store-sub">${storeAddress}</div>
            <div class="store-sub">Phone: ${storePhone} | Email: ${storeEmail}</div>
          </div>
        </div>
        <div class="invoice-meta">
          <div class="invoice-title">PACKING SLIP & BILL</div>
          <div class="order-id">${order.id}</div>
          <div class="store-sub">Date: ${formatDate(order.createdAt)}</div>
          <div class="store-sub" style="margin-top: 4px;">Status: <span class="badge">${order.orderStatus || 'New Order'}</span></div>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <div class="card-title">Customer & Delivery Address</div>
          <div style="font-weight: bold; font-size: 14px; color: #0f172a;">${order.customer.name}</div>
          <div style="color: #475569; margin: 4px 0;">📞 ${order.customer.phone}</div>
          ${order.customer.email ? `<div style="color: #64748b; font-size: 11px;">✉️ ${order.customer.email}</div>` : ''}
          <div style="margin-top: 8px; font-size: 12px; line-height: 1.4; color: #334155;">
            ${order.customer.address}<br />
            <strong>${order.customer.city || 'Kota'}, ${order.customer.state || 'Rajasthan'} - ${order.customer.pincode}</strong>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Order & Payment Info</div>
          <div><strong>Payment Mode:</strong> ${order.paymentMethod || 'Cash on Delivery'}</div>
          <div><strong>Payment Status:</strong> ${order.paymentStatus || 'Pending on Delivery'}</div>
          ${order.paymentId ? `<div><strong>Transaction Ref:</strong> <code style="font-size: 11px;">${order.paymentId}</code></div>` : ''}
          <div style="margin-top: 6px;"><strong>Courier:</strong> ${order.courier || 'Delhivery Express Kota'}</div>
          ${order.trackingNumber ? `<div><strong>AWB / Tracking:</strong> <code>${order.trackingNumber}</code></div>` : ''}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px;">#</th>
            <th>Item Details</th>
            <th style="text-align: center; width: 60px;">Qty</th>
            <th style="text-align: right; width: 100px;">Rate</th>
            <th style="text-align: right; width: 110px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <table class="totals-table">
        <tr>
          <td>Subtotal:</td>
          <td style="text-align: right;">${formatCurrency(order.subtotal || order.total)}</td>
        </tr>
        ${order.discount ? `
        <tr>
          <td style="color: #16a34a;">Coupon Discount:</td>
          <td style="text-align: right; color: #16a34a;">-${formatCurrency(order.discount)}</td>
        </tr>
        ` : ''}
        <tr>
          <td>Shipping Charge:</td>
          <td style="text-align: right;">${order.shipping ? formatCurrency(order.shipping) : 'FREE'}</td>
        </tr>
        <tr class="grand-total">
          <td>Grand Total:</td>
          <td style="text-align: right;">${formatCurrency(order.total)}</td>
        </tr>
      </table>

      <div class="footer">
        <p><strong>Thank you for choosing She & She Kids Wear!</strong></p>
        <p>For exchanges or support, visit our store at Sethiya Complex, Dadabari, Kota or WhatsApp us at +91 88248 44263 within 7 days of delivery.</p>
        <p style="font-size: 10px; color: #94a3b8; margin-top: 10px;">This is a computer generated invoice and serves as an official order packing slip.</p>
      </div>

      <script>
        window.onload = function() {
          // Auto trigger print dialogue for convenience
          // window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Dispatch an asynchronous webhook notification if webhook URL is configured in settings
 */
export async function dispatchOrderWebhook(order, webhookUrl) {
  if (!webhookUrl || !order) return false;

  try {
    const payload = {
      event: "order.created",
      order_id: order.id,
      created_at: order.createdAt,
      customer_name: order.customer?.name,
      customer_phone: order.customer?.phone,
      customer_email: order.customer?.email,
      delivery_address: `${order.customer?.address}, ${order.customer?.city}, ${order.customer?.state} - ${order.customer?.pincode}`,
      total: order.total,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      items_count: (order.items || []).length,
      items: (order.items || []).map(i => ({
        name: i.name,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.price
      }))
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "no-cors" // permits firing to Zapier / Webhooks without strict CORS blocks
    });

    return true;
  } catch (err) {
    console.warn("Could not dispatch order webhook notification:", err);
    return false;
  }
}
