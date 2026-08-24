export async function sendResetEmail(toEmail: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;

  // Pretty printed console fallback
  const fallbackMessage = `
=============================================
[DEVELOPER NOTICE] Password Reset Link:
To: ${toEmail}
Link: ${resetUrl}
=============================================
  `;
  console.log(fallbackMessage);

  if (!apiKey || apiKey.includes('your_resend_api_key_here') || apiKey === '') {
    console.log('Skipping real Resend email dispatch: RESEND_API_KEY is not configured in .env.local.');
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'FINESSE Atelier <onboarding@resend.dev>', // Default Resend test domain
      to: toEmail,
      subject: 'Reset Your Password - FINESSE Atelier',
      html: `
        <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #58111a; background-color: #faf6f0; color: #58111a;">
          <h2 style="font-size: 24px; letter-spacing: 0.2em; text-align: center; border-bottom: 1px solid rgba(88, 17, 26, 0.15); padding-bottom: 20px; font-weight: normal; margin-top: 0;">FINESSE ATELIER</h2>
          <p style="font-size: 14px; font-weight: bold; letter-spacing: 0.05em; margin-bottom: 20px;">Dear Client,</p>
          <p style="font-size: 13px; line-height: 1.8; margin-bottom: 30px; color: #7a3b43;">
            A request has been received to reset the password for your Atelier account. 
            Please select the button below to update your credentials. This secure link is valid for 1 hour.
          </p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="background-color: #58111a; color: #faf6f0; padding: 14px 28px; text-decoration: none; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; display: inline-block; transition: all 0.3s ease;">RESET PASSWORD</a>
          </div>
          <p style="font-size: 11px; line-height: 1.6; color: #7a3b43; margin-bottom: 0;">
            If you did not make this request, you may safely ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid rgba(88, 17, 26, 0.15); margin: 30px 0;" />
          <p style="font-size: 9px; text-align: center; letter-spacing: 0.1em; color: #7a3b43; text-transform: uppercase; margin-bottom: 0;">
            © ${new Date().getFullYear()} FINESSE. All rights reserved.
          </p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Resend API failed: ${res.status} - ${errorText}`);
  }
}
