/**
 * Automated Order Confirmation & Delivery Email Serverless Function
 * Powered by Nodemailer + Hostinger Business SMTP (support@projuktisoft.shop)
 * Endpoint: /.netlify/functions/send-order-email (or /api/send-order-email)
 */

import nodemailer from 'nodemailer';

export const handler = async (event, context) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const {
      customerEmail,
      customerName,
      customerPhone,
      orderId,
      productName,
      totalAmount,
      downloadUrl,
      files = [],
      orderBumpSelected,
      orderBumpName,
      orderBumpDownloadUrl,
      orderBumpFiles = []
    } = data;

    if (!customerEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing customerEmail' })
      };
    }

    const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpUser = process.env.SMTP_USER || 'support@projuktisoft.shop';
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpPass) {
      console.warn('SMTP_PASS is not configured in environment variables');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          warning: 'SMTP_PASS environment variable not set. Email not sent.'
        })
      };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for 587
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const buyerName = customerName || 'Valued Learner';
    const mainTitle = productName || 'Assam Govt Exam 4-in-1 MCQ Ebook Combo';
    const mainDownload = downloadUrl || 'https://drive.google.com/file/d/1Go8qAgTGTkRK6RZxIGSz6-b05HaCikag/view?usp=sharing';
    const bumpDownload = orderBumpDownloadUrl || 'https://drive.google.com/file/d/1Go8qAgTGTkRK6RZxIGSz6-b05HaCikag/view?usp=sharing';

    const filesHtmlList = files.length > 0 
      ? files.map(f => `<li style="margin-bottom: 6px;">✓ ${f}</li>`).join('')
      : `<li style="margin-bottom: 6px;">✓ ADRE All Subject-Wise MCQ Ebook (Grade 3 & 4) [PDF]</li>
         <li style="margin-bottom: 6px;">✓ Bonus 1: SSC GD Complete E-Book (1500+ MCQs) [PDF]</li>
         <li style="margin-bottom: 6px;">✓ Bonus 2: Assam Police SI Dedicated E-Book (2000+ MCQs) [PDF]</li>
         <li style="margin-bottom: 6px;">✓ Bonus 3: Assam Police Constable E-Book (2000+ MCQs) [PDF]</li>`;

    const bumpSection = orderBumpSelected ? `
      <div style="background: #111d24; border: 1px solid #eab308; border-radius: 12px; padding: 18px 20px; margin-top: 24px;">
        <span style="display: inline-block; background: #eab308; color: #000; font-size: 11px; font-weight: 800; padding: 2px 10px; border-radius: 20px; margin-bottom: 8px;">ORDER BUMP INCLUDED</span>
        <h3 style="color: #fef08a; font-size: 16px; margin: 0 0 10px 0;">🎁 ${orderBumpName || 'CTET Paper I & II MCQ Practice Ebook'}</h3>
        <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 16px 0;">Complete CTET Paper I & II Practice Question Bank with Detailed Answers.</p>
        <div style="text-align: center;">
          <a href="${bumpDownload}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #facc15 0%, #eab308 100%); color: #000; font-weight: 800; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 14px rgba(234, 179, 8, 0.4);">
            📥 DOWNLOAD CTET EBOOK (GOOGLE DRIVE)
          </a>
        </div>
      </div>
    ` : '';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your ProjuktiSoft Order Download Link</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #060b0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; line-height: 1.6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #060b0e; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #0d191e; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
              
              <!-- Brand Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #0f232b 0%, #060b0e 100%); padding: 25px 30px; text-align: center; border-bottom: 1px solid rgba(138, 201, 38, 0.2);">
                  <h1 style="margin: 0; font-size: 24px; color: #fff; letter-spacing: 0.5px;">ProjuktiSoft<span style="color: #8ac926;">.shop</span></h1>
                  <p style="margin: 4px 0 0 0; font-size: 13px; color: #8ac926; font-weight: 600;">⚡ Official Digital Learning Store</p>
                </td>
              </tr>

              <!-- Success Alert Banner -->
              <tr>
                <td style="padding: 30px 30px 20px 30px; text-align: center;">
                  <div style="display: inline-block; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; background: rgba(138, 201, 38, 0.15); border: 2px solid #8ac926; color: #8ac926; font-size: 26px; font-weight: bold; margin-bottom: 15px;">
                    ✓
                  </div>
                  <h2 style="margin: 0 0 10px 0; font-size: 22px; color: #ffffff;">Order Confirmed & Payment Verified!</h2>
                  <p style="margin: 0; font-size: 15px; color: #cbd5e1;">Hello <strong>${buyerName}</strong>, thank you for purchasing from ProjuktiSoft! Your exam preparation bundle is ready for instant download below.</p>
                </td>
              </tr>

              <!-- Receipt Box -->
              <tr>
                <td style="padding: 0 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 14px 18px; font-size: 13px; color: #94a3b8;">
                    <tr>
                      <td style="padding: 4px 0;"><strong>Transaction ID:</strong></td>
                      <td align="right" style="padding: 4px 0; color: #f8fafc; font-family: monospace;">${orderId || 'Verified'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0;"><strong>Amount Paid:</strong></td>
                      <td align="right" style="padding: 4px 0; color: #8ac926; font-weight: bold; font-size: 14px;">₹${totalAmount || '99'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0;"><strong>Delivery:</strong></td>
                      <td align="right" style="padding: 4px 0; color: #10b981; font-weight: 600;">Instant Digital Access (Lifetime)</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Primary Download Box -->
              <tr>
                <td style="padding: 24px 30px;">
                  <div style="background: #102129; border: 1px solid rgba(138, 201, 38, 0.35); border-radius: 12px; padding: 22px 20px;">
                    <h3 style="margin: 0 0 12px 0; color: #a3e635; font-size: 17px;">📥 ${mainTitle}</h3>
                    <ul style="margin: 0 0 18px 0; padding-left: 18px; color: #e2e8f0; font-size: 13px; line-height: 1.6;">
                      ${filesHtmlList}
                    </ul>
                    <div style="text-align: center;">
                      <a href="${mainDownload}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #a3e635 0%, #8ac926 100%); color: #040809; font-weight: 800; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 16px rgba(138, 201, 38, 0.4); text-transform: uppercase;">
                        🚀 ACCESS & DOWNLOAD ALL FILES (GOOGLE DRIVE)
                      </a>
                    </div>
                  </div>

                  <!-- CTET Order Bump Section (if purchased) -->
                  ${bumpSection}

                  <!-- Self-Service Notice -->
                  <div style="background: rgba(255, 255, 255, 0.02); border-left: 3px solid #8ac926; padding: 14px 16px; border-radius: 6px; margin-top: 24px; font-size: 13px; color: #94a3b8;">
                    <strong>💡 Lifetime Backup:</strong> You can also access and re-download your files anytime on our website using your email or WhatsApp number at <a href="https://projuktisoft.shop/my-downloads" target="_blank" style="color: #8ac926; text-decoration: underline;">projuktisoft.shop/my-downloads</a>.
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px; color: #64748b;">
                  <p style="margin: 0 0 6px 0;">Need help with your download? Reply directly to this email or write to <a href="mailto:support@projuktisoft.shop" style="color: #8ac926; text-decoration: none;">support@projuktisoft.shop</a></p>
                  <p style="margin: 0;">© 2026 ProjuktiSoft. All rights reserved. • Guwahati, Assam</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"ProjuktiSoft Store" <${smtpUser}>`,
      to: customerEmail,
      subject: `🎉 Download Your Ebooks: ${mainTitle} [Order Confirmed]`,
      text: `Hello ${buyerName},\n\nThank you for purchasing ${mainTitle} from ProjuktiSoft.\n\nYour download link: ${mainDownload}\n\nLifetime downloads portal: https://projuktisoft.shop/my-downloads\n\nTransaction ID: ${orderId}\nAmount Paid: ₹${totalAmount}\n\nBest regards,\nProjuktiSoft Team`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order email sent successfully:', info.messageId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, messageId: info.messageId })
    };
  } catch (error) {
    console.error('Error sending order email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Failed to send email' })
    };
  }
};
