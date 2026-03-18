import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY")!;
const FROM_EMAIL = "info@scratchvanish.com";
const FROM_NAME = "Scratch Vanish";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${ampm}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { job } = await req.json();

    if (!job.client_email) {
      return new Response(JSON.stringify({ message: "No email address, skipping" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const dateFormatted = formatDate(job.date);
    const startTime = formatTime(job.start_time);
    const endTime = formatTime(job.end_time);
    const address = `${job.address}, ${job.suburb}`;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Booking Confirmation - Scratch Vanish</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body, table, td, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #f0f2f5;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .content-pad { padding: 28px 20px !important; }
      .header-pad { padding: 28px 20px 20px 20px !important; }
      .footer-pad { padding: 28px 20px !important; }
      .btn-table { display: block !important; width: 100% !important; }
      .btn-cell { display: block !important; width: 100% !important; padding: 5px 0 !important; }
      .btn-link { display: block !important; text-align: center !important; }
      .contact-link { display: block !important; margin: 8px 0 !important; }
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f2f5; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="email-container" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">

          <!-- ═══ HEADER ═══ -->
          <tr>
            <td class="header-pad" style="background-color: #ffffff; padding: 36px 30px 28px 30px; text-align: center; border-bottom: 3px solid #283891;">
              <img src="https://scratchvanish.com.au/wp-content/uploads/2021/11/logo.png" alt="Scratch Vanish" style="max-width: 220px; height: auto; display: block; margin: 0 auto;">
            </td>
          </tr>

          <!-- ═══ MAIN CONTENT ═══ -->
          <tr>
            <td class="content-pad" style="padding: 40px 30px; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">

              <!-- Greeting -->
              <p style="font-size: 24px; color: #283891; margin: 0 0 16px 0; font-weight: 800; letter-spacing: -0.5px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                Hi {{CLIENT_NAME}}, you're all booked in 🎉
              </p>
              <p style="font-size: 16px; color: #4a5568; line-height: 1.7; margin: 0 0 24px 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                Thanks for choosing Scratch Vanish. We're looking forward to getting your car looking its best. Here's everything you need to know about your upcoming appointment.
              </p>

              <!-- Confirmation badge -->
              <div style="background: #e8edf8; border-left: 4px solid #283891; padding: 16px 20px; margin: 0 0 28px 0; border-radius: 8px;">
                <p style="font-size: 15px; color: #283891; margin: 0; font-weight: 700; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  ✓ &nbsp;Booking confirmed, we'll see you soon
                </p>
              </div>

              <!-- Booking Details Box -->
              <div style="background: #fef3e7; border-radius: 10px; padding: 24px; margin: 0 0 28px 0; border-left: 4px solid #ff7e18;">
                <h3 style="font-size: 16px; color: #283891; margin: 0 0 16px 0; font-weight: 800; letter-spacing: -0.2px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  📋 &nbsp;Your Booking Details
                </h3>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="font-size: 14px; color: #64748b; padding: 8px 0; width: 38%; font-weight: 600; vertical-align: top; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                      📅 &nbsp;Date
                    </td>
                    <td style="font-size: 14px; color: #1e293b; padding: 8px 0; font-weight: 700; vertical-align: top; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                      {{DATE_FORMATTED}}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #64748b; padding: 8px 0; font-weight: 600; vertical-align: top; border-top: 1px solid rgba(255,126,24,0.2); font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                      🕐 &nbsp;Time Slot
                    </td>
                    <td style="font-size: 14px; color: #1e293b; padding: 8px 0; font-weight: 700; vertical-align: top; border-top: 1px solid rgba(255,126,24,0.2); font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                      {{START_TIME}} to {{END_TIME}}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #64748b; padding: 8px 0; font-weight: 600; vertical-align: top; border-top: 1px solid rgba(255,126,24,0.2); font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                      📍 &nbsp;Location
                    </td>
                    <td style="font-size: 14px; color: #1e293b; padding: 8px 0; font-weight: 700; vertical-align: top; border-top: 1px solid rgba(255,126,24,0.2); font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                      {{ADDRESS}}, {{SUBURB}}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- What to Expect -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 28px; margin: 0 0 28px 0; border: 2px solid #e2e8f0;">
                <h2 style="font-size: 20px; color: #1e293b; margin: 0 0 20px 0; font-weight: 800; letter-spacing: -0.3px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  What to expect on the day
                </h2>

                <!-- Step 1 -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px;">
                  <tr>
                    <td style="vertical-align: top; width: 36px; padding-top: 2px;">
                      <div style="width: 28px; height: 28px; background-color: #283891; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 13px; font-weight: 800; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">1</div>
                    </td>
                    <td style="vertical-align: top; padding-left: 12px;">
                      <p style="font-size: 15px; font-weight: 800; color: #1e293b; margin: 0 0 4px 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">We'll call you 30 minutes before we arrive</p>
                      <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Keep your phone handy so we can let you know we're on our way.</p>
                    </td>
                  </tr>
                </table>

                <!-- Step 2 -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px;">
                  <tr>
                    <td style="vertical-align: top; width: 36px; padding-top: 2px;">
                      <div style="width: 28px; height: 28px; background-color: #283891; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 13px; font-weight: 800; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">2</div>
                    </td>
                    <td style="vertical-align: top; padding-left: 12px;">
                      <p style="font-size: 15px; font-weight: 800; color: #1e293b; margin: 0 0 4px 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Please ensure your vehicle is accessible</p>
                      <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Make sure your car is parked and ready for our technician when they arrive.</p>
                    </td>
                  </tr>
                </table>

                <!-- Step 3 -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="vertical-align: top; width: 36px; padding-top: 2px;">
                      <div style="width: 28px; height: 28px; background-color: #ff7e18; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 13px; font-weight: 800; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">3</div>
                    </td>
                    <td style="vertical-align: top; padding-left: 12px;">
                      <p style="font-size: 15px; font-weight: 800; color: #1e293b; margin: 0 0 6px 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Need to reschedule</p>
                      <p style="font-size: 14px; color: #64748b; margin: 0 0 12px 0; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">No worries, just reach out as soon as possible and we'll sort a new time for you.</p>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="btn-table">
                        <tr>
                          <td class="btn-cell" style="padding-right: 10px;">
                            <a href="/cdn-cgi/l/email-protection#bed7d0d8d1fecdddccdfcaddd6c8dfd0d7cdd690ddd1d390dfcb" class="btn-link" style="display: inline-block; background-color: #283891; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 16px; border-radius: 6px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                              ✉ &nbsp;Send us an email
                            </a>
                          </td>
                          <td class="btn-cell">
                            <a href="https://wa.me/610467551564" class="btn-link" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 16px; border-radius: 6px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                              💬 &nbsp;Connect via WhatsApp
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Stay Connected box -->
              <div style="background: #e8edf8; border-radius: 10px; padding: 20px 24px; margin: 0 0 28px 0;">
                <h3 style="font-size: 16px; color: #283891; margin: 0 0 12px 0; font-weight: 800; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">💬 &nbsp;Stay Connected</h3>
                <p style="font-size: 14px; color: #4a5568; margin: 8px 0; font-weight: 500; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  📞 &nbsp;<strong style="color: #1e293b;">Save our number:</strong> <a href="tel:0467551564" style="color: #283891; font-weight: 700; text-decoration: none;">0467 551 564</a>
                </p>
                <p style="font-size: 14px; color: #4a5568; margin: 8px 0; font-weight: 500; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  💬 &nbsp;<strong style="color: #1e293b;">WhatsApp us</strong> for any quick questions before your appointment
                </p>
                <p style="font-size: 14px; color: #4a5568; margin: 8px 0; font-weight: 500; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  👥 &nbsp;<strong style="color: #1e293b;">Know someone who needs car repairs?</strong> Share our details
                </p>
              </div>

              <!-- Signature -->
              <div style="text-align: center; padding: 24px 20px; background-color: #f8fafc; border-radius: 10px;">
                <p style="font-weight: 800; color: #283891; font-size: 18px; margin: 0 0 6px 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">The Scratch Vanish Team</p>
                <p style="font-size: 15px; color: #64748b; margin: 0; font-weight: 600; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">📞 0467 551 564</p>
              </div>

            </td>
          </tr>

          <!-- ═══ FOOTER ═══ -->
          <tr>
            <td class="footer-pad" style="background-color: #1e293b; padding: 35px 30px;">
              <p style="font-size: 16px; color: #ff7e18; margin: 0 0 20px 0; font-weight: 800; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Our Services</p>

              <div style="text-align: center; margin: 0 0 25px 0;">
                <span style="background-color: rgba(255,255,255,0.1); color: #ffffff; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Bumper Repair</span>
                <span style="background-color: rgba(255,255,255,0.1); color: #ffffff; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Alloy Wheel Repair</span>
                <span style="background-color: rgba(255,255,255,0.1); color: #ffffff; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Scratch Repair</span>
                <span style="background-color: rgba(255,255,255,0.1); color: #ffffff; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Wheel Arch Repair</span>
                <span style="background-color: rgba(255,255,255,0.1); color: #ffffff; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Door Scratch Repair</span>
                <span style="background-color: rgba(255,255,255,0.1); color: #ffffff; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Pre-Sale Car Cleanup</span>
              </div>

              <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 24px; text-align: center;">
                <a href="tel:0467551564" class="contact-link" style="color: #ff7e18; text-decoration: none; font-size: 14px; font-weight: 600; margin: 0 12px; display: inline-block; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  📞 0467 551 564
                </a>
                <a href="https://wa.me/610467551564" class="contact-link" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; margin: 0 12px; display: inline-block; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  💬 WhatsApp
                </a>
                <a href="https://scratchvanish.com.au" class="contact-link" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; margin: 0 12px; display: inline-block; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  🌐 Website
                </a>
                <a href="/cdn-cgi/l/email-protection#99f0f7fff6d9eafaebf8edfaf1eff8f7f0eaf1b7faf6f4b7f8ec" class="contact-link" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; margin: 0 12px; display: inline-block; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  ✉️ Email
                </a>
              </div>

              <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin: 20px 0 0 0; text-align: center; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                This is an automated confirmation, please do not reply to this email.<br>
                &copy; 2026 Scratch Vanish Pty Ltd. All rights reserved.
              </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    const emailPayload = {
      personalizations: [
        {
          to: [{ email: job.client_email, name: job.client_name }],
          subject: `Booking Confirmed - Scratch Vanish - ${dateFormatted}`,
        },
      ],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      content: [{ type: "text/html", value: htmlContent }],
    };

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid error: ${error}`);
    }

    return new Response(JSON.stringify({ message: "Email sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});