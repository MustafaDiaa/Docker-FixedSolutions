const buildConfirmationEmail = ({ name, token }) => {
  const appName = process.env.APP_NAME || 'Bookly';
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:5000';
  const confirmUrl = `${baseUrl}/auth/confirm-email?token=${token}`;
  const logoUrl = `${baseUrl}/assets/logo.png`;
  const currentYear = new Date().getFullYear();

  return {
    subject: `Welcome to ${appName} - Please Confirm Your Email`,
    html: `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Confirm Your Email - ${appName}</title>
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
            background-color: #f4f7fa;
          }
          
          /* Container */
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          
          /* Header */
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
            color: #1a202c;
            margin: 0 0 16px 0;
            line-height: 1.3;
          }
          
          .message {
            font-size: 16px;
            line-height: 1.6;
            color: #4a5568;
            margin: 0 0 32px 0;
          }
          
          /* CTA Button */
          .cta-container {
            text-align: center;
            margin: 32px 0;
          }
          
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 48px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
            transition: transform 0.2s;
          }
          
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
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
            color: #667eea;
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
            background-color: #fffbeb;
            border-left: 4px solid #f59e0b;
            border-radius: 4px;
          }
          
          /* Footer */
          .footer {
            background-color: #1a202c;
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
            background-color: #2d3748;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s;
          }
          
          .social-link:hover .social-icon {
            background-color: #667eea;
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
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f7fa;">
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
                    <h2 class="greeting">Welcome aboard, ${name || 'Reader'}! 📚</h2>
                    
                    <p class="message">
                      Thank you for joining ${appName}! We're thrilled to have you as part of our community of book lovers. 
                      To get started and unlock full access to your account, please confirm your email address.
                    </p>
                    
                    <div class="cta-container">
                      <a href="${confirmUrl}" class="cta-button">Confirm Email Address</a>
                    </div>
                    
                    <div class="alt-link-section">
                      <p class="alt-link-title">Button not working? Copy and paste this link:</p>
                      <a href="${confirmUrl}" class="alt-link">${confirmUrl}</a>
                    </div>
                    
                    <hr class="divider">
                    
                    <p class="security-notice">
                      <strong>Security Note:</strong> If you didn't create an account with ${appName}, please disregard this email. 
                      This link will expire in 24 hours for your security.
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

module.exports = { buildConfirmationEmail };