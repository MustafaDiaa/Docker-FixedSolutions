const buildResetPasswordEmail = ({ name, token }) => {
  const appName = process.env.APP_NAME || 'Bookly';
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:5000';
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;
  const logoUrl = `${baseUrl}/assets/logo.png`;
  const currentYear = new Date().getFullYear();

  return {
    subject: `Reset Your ${appName} Password`,
    html: `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Reset Your Password - ${appName}</title>
        <!--[if mso]>
        <style type="text/css">
          body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
        </style>
        <![endif]-->
        <style>
          /* Reset styles */
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
          
          /* Base styles */
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #f8f9fa;
          }
          
          /* Container */
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          
          /* Header */
          .header {
            background-color: #5a67d8;
            padding: 40px 30px;
            text-align: center;
          }
          
          .logo-container {
            display: inline-block;
            margin-bottom: 16px;
          }
          
          .logo {
            width: 64px;
            height: 64px;
            border-radius: 12px;
            background-color: #ffffff;
            padding: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .company-name {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
          }
          
          .company-tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin: 8px 0 0 0;
            font-weight: 400;
          }
          
          /* Content */
          .content {
            padding: 48px 40px;
          }
          
          .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #2d3748;
            margin: 0 0 16px 0;
            line-height: 1.3;
          }
          
          .message {
            font-size: 16px;
            line-height: 1.6;
            color: #4a5568;
            margin: 0 0 24px 0;
          }
          
          /* Alert Box */
          .alert-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px 20px;
            border-radius: 6px;
            margin: 24px 0;
          }
          
          .alert-title {
            font-size: 14px;
            font-weight: 600;
            color: #92400e;
            margin: 0 0 8px 0;
          }
          
          .alert-text {
            font-size: 14px;
            color: #78350f;
            margin: 0;
            line-height: 1.5;
          }
          
          /* CTA Button */
          .cta-container {
            text-align: center;
            margin: 32px 0;
          }
          
          .cta-button {
            display: inline-block;
            background-color: #5a67d8;
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 48px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(90, 103, 216, 0.3);
            transition: all 0.3s ease;
          }
          
          .cta-button:hover {
            background-color: #4c51bf;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(90, 103, 216, 0.4);
          }
          
          /* Info Box */
          .info-box {
            background-color: #f0f4ff;
            border: 1px solid #c7d2fe;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
          }
          
          .info-title {
            font-size: 14px;
            font-weight: 600;
            color: #3730a3;
            margin: 0 0 12px 0;
          }
          
          .info-list {
            margin: 0;
            padding-left: 20px;
            color: #4c51bf;
          }
          
          .info-list li {
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 8px;
            color: #4338ca;
          }
          
          /* Alternative link */
          .alt-link-section {
            background-color: #f7fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 32px 0;
          }
          
          .alt-link-title {
            font-size: 13px;
            color: #718096;
            margin: 0 0 8px 0;
            font-weight: 500;
          }
          
          .alt-link {
            font-size: 12px;
            color: #5a67d8;
            word-break: break-all;
            text-decoration: none;
          }
          
          /* Divider */
          .divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 32px 0;
          }
          
          /* Security notice */
          .security-notice {
            font-size: 13px;
            color: #718096;
            line-height: 1.5;
            margin: 0;
            padding: 16px;
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            border-radius: 4px;
          }
          
          .security-notice strong {
            color: #991b1b;
          }
          
          /* Footer */
          .footer {
            background-color: #2d3748;
            padding: 40px 30px;
            text-align: center;
          }
          
          .social-section {
            margin-bottom: 24px;
          }
          
          .social-title {
            color: #a0aec0;
            font-size: 14px;
            margin: 0 0 16px 0;
            font-weight: 500;
          }
          
          .social-links {
            display: inline-block;
          }
          
          .social-link {
            display: inline-block;
            margin: 0 8px;
            text-decoration: none;
          }
          
          .social-icon {
            width: 36px;
            height: 36px;
            background-color: #4a5568;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s;
          }
          
          .social-link:hover .social-icon {
            background-color: #5a67d8;
          }
          
          /* Using Unicode symbols as fallback for social icons */
          .icon-facebook::before { content: 'f'; color: #ffffff; font-size: 18px; font-weight: bold; }
          .icon-twitter::before { content: '𝕏'; color: #ffffff; font-size: 16px; }
          .icon-instagram::before { content: '◉'; color: #ffffff; font-size: 18px; }
          .icon-linkedin::before { content: 'in'; color: #ffffff; font-size: 14px; font-weight: bold; }
          
          .footer-links {
            margin: 20px 0;
          }
          
          .footer-link {
            color: #a0aec0;
            text-decoration: none;
            font-size: 13px;
            margin: 0 12px;
            transition: color 0.3s;
          }
          
          .footer-link:hover {
            color: #ffffff;
          }
          
          .footer-text {
            color: #718096;
            font-size: 12px;
            line-height: 1.5;
            margin: 16px 0 0 0;
          }
          
          .copyright {
            color: #4a5568;
            font-size: 12px;
            margin: 16px 0 0 0;
          }
          
          /* Responsive */
          @media only screen and (max-width: 600px) {
            .email-container {
              width: 100% !important;
            }
            .content {
              padding: 32px 24px !important;
            }
            .header {
              padding: 32px 24px !important;
            }
            .footer {
              padding: 32px 24px !important;
            }
            .greeting {
              font-size: 22px !important;
            }
            .message {
              font-size: 15px !important;
            }
            .cta-button {
              padding: 14px 32px !important;
              font-size: 15px !important;
            }
            .footer-link {
              display: block;
              margin: 8px 0 !important;
            }
          }
        </style>
      </head>
      <body>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="600" align="center">
                
                <!-- Header -->
                <tr>
                  <td class="header">
                    <div class="logo-container">
                      <img src="${logoUrl}" alt="${appName}" class="logo" width="64" height="64">
                    </div>
                    <h1 class="company-name">${appName}</h1>
                    <p class="company-tagline">Your Gateway to Endless Stories</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td class="content">
                    <h2 class="greeting">Password Reset Request</h2>
                    
                    <p class="message">
                      Hi ${name || 'there'},
                    </p>
                    
                    <p class="message">
                      We received a request to reset the password for your ${appName} account. 
                      If you made this request, click the button below to create a new password.
                    </p>
                    
                    <div class="alert-box">
                      <p class="alert-title">⏱️ Time-Sensitive Action Required</p>
                      <p class="alert-text">
                        For your security, this password reset link will expire in 1 hour. 
                        Please complete the process as soon as possible.
                      </p>
                    </div>
                    
                    <div class="cta-container">
                      <a href="${resetUrl}" class="cta-button">Reset My Password</a>
                    </div>
                    
                    <div class="alt-link-section">
                      <p class="alt-link-title">Button not working? Copy and paste this link:</p>
                      <a href="${resetUrl}" class="alt-link">${resetUrl}</a>
                    </div>
                    
                    <div class="info-box">
                      <p class="info-title">🔐 Password Security Tips:</p>
                      <ul class="info-list">
                        <li>Use at least 8 characters with a mix of letters, numbers, and symbols</li>
                        <li>Avoid using common words or personal information</li>
                        <li>Don't reuse passwords from other accounts</li>
                        <li>Consider using a password manager for better security</li>
                      </ul>
                    </div>
                    
                    <hr class="divider">
                    
                    <p class="security-notice">
                      <strong>⚠️ Security Alert:</strong> If you didn't request a password reset, please ignore this email 
                      and ensure your account is secure. Your password will remain unchanged. 
                      If you're concerned about your account security, please contact our support team immediately.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td class="footer">
                    <div class="social-section">
                      <p class="social-title">Connect With Us</p>
                      <div class="social-links">
                        <a href="https://facebook.com/${appName.toLowerCase()}" class="social-link">
                          <span class="social-icon icon-facebook"></span>
                        </a>
                        <a href="https://twitter.com/${appName.toLowerCase()}" class="social-link">
                          <span class="social-icon icon-twitter"></span>
                        </a>
                        <a href="https://instagram.com/${appName.toLowerCase()}" class="social-link">
                          <span class="social-icon icon-instagram"></span>
                        </a>
                        <a href="https://linkedin.com/company/${appName.toLowerCase()}" class="social-link">
                          <span class="social-icon icon-linkedin"></span>
                        </a>
                      </div>
                    </div>
                    
                    <div class="footer-links">
                      <a href="${baseUrl}/help" class="footer-link">Help Center</a>
                      <a href="${baseUrl}/privacy" class="footer-link">Privacy Policy</a>
                      <a href="${baseUrl}/terms" class="footer-link">Terms of Service</a>
                      <a href="${baseUrl}/contact" class="footer-link">Contact Us</a>
                    </div>
                    
                    <p class="footer-text">
                      ${appName}, 123 Book Street, Reading City, RC 12345
                    </p>
                    
                    <p class="copyright">
                      © ${currentYear} ${appName}. All rights reserved.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };
};

module.exports = { buildResetPasswordEmail };