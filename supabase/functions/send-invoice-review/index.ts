import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY")!;
const FROM_EMAIL = "info@scratchvanish.com";
const FROM_NAME = "Scratch Vanish";

const GOOGLE_NORTH = "https://g.page/r/CXqPf5SoOzCUEBM/review";
const GOOGLE_EAST = "https://g.page/r/CRWQ5WzcF_3CEBM/review";
const FACEBOOK_REVIEW = "https://www.facebook.com/scratchvanishofficial/reviews";

// Northern Sydney postcodes
const NORTHERN_POSTCODES = [
    2060, 2061, 2062, 2063, 2064, 2065, 2066, 2067, 2068, 2069,
    2070, 2071, 2072, 2073, 2074, 2075, 2076, 2077, 2079, 2080,
    2081, 2082, 2083, 2084, 2085, 2086, 2087, 2088, 2089, 2090,
    2091, 2092, 2093, 2094, 2095, 2096, 2097, 2098, 2099, 2100,
    2101, 2102, 2103, 2104, 2105, 2106, 2107, 2108, 2109, 2110,
    2111, 2112, 2113, 2114, 2115, 2116, 2117, 2118, 2119, 2120,
    2121, 2122, 2125, 2126
];

// Eastern Suburbs postcodes
const EASTERN_POSTCODES = [
    2010, 2011, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022,
    2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032,
    2033, 2034, 2035, 2036
];

// Western Sydney postcodes - use Northern link
const WESTERN_POSTCODES = [
    2140, 2141, 2142, 2143, 2144, 2145, 2146, 2147, 2148, 2149,
    2150, 2151, 2152, 2153, 2154, 2155, 2156, 2157, 2158, 2159,
    2160, 2161, 2162, 2163, 2164, 2165, 2166, 2167, 2168, 2169,
    2170, 2171, 2172, 2173, 2174, 2175, 2176, 2177, 2178, 2179,
    2190, 2191, 2192, 2193, 2194, 2195, 2196, 2197, 2198, 2199,
    2200, 2747, 2748, 2749, 2750, 2760, 2761, 2762, 2763, 2765,
    2766, 2767, 2768, 2769, 2770
];

// Southern Sydney postcodes - use Eastern link
const SOUTHERN_POSTCODES = [
    2195, 2196, 2197, 2198, 2199, 2200, 2203, 2204, 2205, 2206,
    2207, 2208, 2209, 2210, 2211, 2212, 2213, 2214, 2216, 2217,
    2218, 2219, 2220, 2221, 2222, 2223, 2224, 2225, 2226, 2227,
    2228, 2229, 2230, 2231, 2232, 2233, 2234, 2560, 2563, 2564,
    2565, 2566, 2567, 2568, 2569, 2570
];

function getGoogleReviewLink(postcode: string): string {
    const code = parseInt(postcode);
    if (NORTHERN_POSTCODES.includes(code)) return GOOGLE_NORTH;
    if (EASTERN_POSTCODES.includes(code)) return GOOGLE_EAST;
    if (WESTERN_POSTCODES.includes(code)) return GOOGLE_NORTH;
    if (SOUTHERN_POSTCODES.includes(code)) return GOOGLE_EAST;
    return GOOGLE_NORTH; // default
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
        const { job, invoice, includeReview = true } = await req.json();

        if (!job.client_email) {
            return new Response(JSON.stringify({ message: "No email address, skipping" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        const googleLink = getGoogleReviewLink(job.postcode || "2065");
        const invoiceUrl = `https://job-management-system-tau.vercel.app/invoice/${invoice.invoice_number}-${invoice.token}`;

        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice & Review Request - Scratch Vanish</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body, table, td, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #f0f2f5;
      font-family: 'Plus Jakarta Sans', Arial, sans-serif;
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
      .contact-link { display: block !important; margin: 8px 0 !important; }
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f2f5; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="email-container" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">

          <!-- HEADER -->
          <tr>
            <td class="header-pad" style="background-color: #ffffff; padding: 36px 30px 28px 30px; text-align: center; border-bottom: 3px solid #283891;">
              <img src="https://scratchvanish.com.au/wp-content/uploads/2021/11/logo.png" alt="Scratch Vanish" style="max-width: 220px; height: auto; display: block; margin: 0 auto;">
            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td class="content-pad" style="padding: 40px 30px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">

              <!-- Greeting -->
              <p style="font-size: 24px; color: #283891; margin: 0 0 16px 0; font-weight: 800; letter-spacing: -0.5px;">
                Hi ${job.client_name}, thank you for choosing us 🙏
              </p>
              <p style="font-size: 16px; color: #4a5568; line-height: 1.7; margin: 0 0 28px 0;">
                It was a pleasure working on your car. Please find your invoice below and we would love to hear your feedback.
              </p>

              <!-- Invoice Box -->
              <div style="background: #fef3e7; border-radius: 10px; padding: 24px; margin: 0 0 28px 0; border-left: 4px solid #ff7e18;">
                <h3 style="font-size: 16px; color: #283891; margin: 0 0 12px 0; font-weight: 800;">
                  📄 &nbsp;Your Invoice
                </h3>
                <p style="font-size: 14px; color: #4a5568; margin: 0 0 16px 0; line-height: 1.6;">
                  Invoice <strong>${invoice.invoice_number}</strong> for $${parseFloat(invoice.total).toFixed(2)} is ready to view and download.
                </p>
                <a href="${invoiceUrl}" style="display: inline-block; background-color: #283891; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 6px;">
                  View &amp; Download Invoice
                </a>
              </div>

              ${includeReview ? `
                            <!-- Review Request -->
                            <div style="background: #f8fafc; border-radius: 12px; padding: 28px; margin: 0 0 28px 0; border: 2px solid #e2e8f0;">
                              <h2 style="font-size: 20px; color: #1e293b; margin: 0 0 8px 0; font-weight: 800;">
                                How did we do? 🙏
                              </h2>
                              <p style="font-size: 15px; color: #4a5568; line-height: 1.7; margin: 0 0 20px 0;">
                                Your feedback means the world to us and helps other car owners find quality repair they can trust. It only takes 2 minutes.
                              </p>

                              <!-- Google Review -->
                              <div style="background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; padding: 16px; margin-bottom: 12px;">
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                  <div style="width: 40px; height: 40px; background: #ffffff; border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px; border: 1px solid #e2e8f0; font-weight: 800; color: #4285f4; flex-shrink: 0;">G</div>
                                  <div>
                                    <p style="font-size: 14px; font-weight: 800; color: #1e293b; margin: 0 0 2px 0;">Google Review</p>
                                    <p style="font-size: 12px; color: #64748b; margin: 0;">Helps new customers find us on Google</p>
                                  </div>
                                </div>
                                <a href="${googleLink}" style="display: block; background-color: #283891; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 12px; border-radius: 8px; text-align: center;">Leave a Google Review</a>
                              </div>

                              <!-- Facebook Review -->
                              <div style="background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; padding: 16px;">
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                  <div style="width: 40px; height: 40px; background: #1877f2; border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px; color: #ffffff; font-weight: 800; flex-shrink: 0;">f</div>
                                  <div>
                                    <p style="font-size: 14px; font-weight: 800; color: #1e293b; margin: 0 0 2px 0;">Facebook Review</p>
                                    <p style="font-size: 12px; color: #64748b; margin: 0;">Share your experience on our Facebook page</p>
                                  </div>
                                </div>
                                <a href="${FACEBOOK_REVIEW}" style="display: block; background-color: #1877f2; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 12px; border-radius: 8px; text-align: center;">Leave a Facebook Review</a>
                              </div>
                            </div>
              ` : ''}

              <!-- Thank you note -->
              <div style="background: #e8edf8; border-left: 4px solid #283891; padding: 16px 20px; margin: 0 0 28px 0; border-radius: 0 8px 8px 0;">
                <p style="font-size: 15px; color: #283891; margin: 0; font-weight: 700;">Thank you for choosing Scratch Vanish 🚗</p>
                <p style="font-size: 14px; color: #4a5568; margin: 6px 0 0 0; line-height: 1.6;">We look forward to helping you again whenever you need us.</p>
              </div>

              <!-- Stay Connected -->
              <div style="background: #e8edf8; border-radius: 10px; padding: 20px 24px; margin: 0 0 28px 0;">
                <h3 style="font-size: 16px; color: #283891; margin: 0 0 12px 0; font-weight: 800;">💬 &nbsp;Stay Connected</h3>
                <p style="font-size: 14px; color: #4a5568; margin: 8px 0; font-weight: 500;">
                  📞 &nbsp;<strong style="color: #1e293b;">Save our number:</strong> <a href="tel:0467551564" style="color: #283891; font-weight: 700; text-decoration: none;">0467 551 564</a>
                </p>
                <p style="font-size: 14px; color: #4a5568; margin: 8px 0; font-weight: 500;">
                  💬 &nbsp;<strong style="color: #1e293b;">WhatsApp us</strong> for any quick questions or future bookings
                </p>
                <p style="font-size: 14px; color: #4a5568; margin: 8px 0; font-weight: 500;">
                  👥 &nbsp;<strong style="color: #1e293b;">Know someone who needs car repairs?</strong> Share our details
                </p>
              </div>

              <!-- Signature -->
              <div style="text-align: center; padding: 24px 20px; background-color: #f8fafc; border-radius: 10px;">
                <p style="font-weight: 800; color: #283891; font-size: 18px; margin: 0 0 6px 0;">The Scratch Vanish Team</p>
                <p style="font-size: 15px; color: #64748b; margin: 0; font-weight: 600;">📞 0467 551 564</p>
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="footer-pad" style="background-color: #1e293b; padding: 35px 30px;">
              <p style="font-size: 16px; color: #ff7e18; margin: 0 0 20px 0; font-weight: 800; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">Our Services</p>
              <div style="text-align: center; margin: 0 0 25px 0;">
                <span style="background-color: rgba(255,255,255,0.1); color: #ffffff; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px;">Bumper Repair</span>
                <span style="background-color: rgba(255,255,255,0.1); color: #ffffff; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px;">Alloy Wheel Repair</span>
                <span style="background-color: rgba(255,255,255,0.1); color: #ffffff; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px;">Scratch Repair</span>
                <span style="background-color: rgba(255,255,255,0.1); color: #ffffff; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px;">Wheel Arch Repair</span>
                <span style="background-color: rgba(255,255,255,0.1); color: #ffffff; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px;">Door Scratch Repair</span>
                <span style="background-color: rgba(255,255,255,0.1); color: #ffffff; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px;">Dent Repair</span>
                <span style="background-color: rgba(255,255,255,0.1); color: #ffffff; padding: 7px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; margin: 4px;">Pre-Sale Car Cleanup</span>
              </div>
              <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 24px; text-align: center;">
                <a href="tel:0467551564" class="contact-link" style="color: #ff7e18; text-decoration: none; font-size: 14px; font-weight: 600; margin: 0 12px; display: inline-block;">📞 0467 551 564</a>
                <a href="https://wa.me/610467551564" class="contact-link" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; margin: 0 12px; display: inline-block;">💬 WhatsApp</a>
                <a href="https://scratchvanish.com.au" class="contact-link" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; margin: 0 12px; display: inline-block;">🌐 Website</a>
                <a href="mailto:info@scratchvanish.com" class="contact-link" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; margin: 0 12px; display: inline-block;">✉️ Email</a>
              </div>
              <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin: 20px 0 0 0; text-align: center; line-height: 1.6;">
                This is an automated email, please do not reply to this email.<br>
                &copy; 2026 Scratch Vanish Pty Ltd. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        const emailPayload = {
            personalizations: [
                {
                    to: [{ email: job.client_email, name: job.client_name }],
                    subject: `Your Invoice & How Did We Do? – Scratch Vanish`,
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