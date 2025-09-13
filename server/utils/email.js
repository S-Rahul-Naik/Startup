// Helper to build Cloudinary download URL with fl_attachment and original filename
function getDownloadUrl(url, originalname) {
  if (!url || !originalname) return url;
  // Always use query param for all file types
  const baseUrl = url.split('?')[0];
  return baseUrl + '?fl_attachment=' + encodeURIComponent(originalname);
}
const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };
  console.log('[EMAIL DEBUG] Creating transporter with config:', config);
  return nodemailer.createTransport(config);
};

// Email templates
const emailTemplates = {
  welcome: (data) => ({
    subject: 'Welcome to Edu Tech!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Edu Tech!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your journey to academic excellence starts here</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${data.name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining Edu Tech! We're excited to have you as part of our community.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Profile Details:</h3>
            <p><strong>Domain:</strong> ${data.domain}</p>
            <p><strong>Qualification:</strong> ${data.qualification}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            With Edu Tech, you'll have access to:
          </p>
          
          <ul style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            <li>High-quality academic projects</li>
            <li>Expert mentorship and support</li>
            <li>Comprehensive project documentation</li>
            <li>24/7 customer support</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/projects" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Explore Projects
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you have any questions or need assistance, feel free to contact our support team.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin: 0;">
            Best regards,<br>
            The Edu Tech Team
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2025 Edu Tech. All rights reserved.</p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #f3f3f3; letter-spacing: 0.5px;">
            <span style="font-weight: 500;">Contact:</span> <span style="color: #ffd166;">+91 76720 39975</span>
            <span style="margin: 0 8px; color: #888;">|</span>
            <a href="mailto:edutech956@gmail.com" style="color: #4fc3f7; text-decoration: underline;">edutech956@gmail.com</a>
          </p>
        </div>
      </div>
    `
  }),
  
  passwordReset: (data) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Secure your account</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${data.name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your Edu Tech account.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <a href="${data.resetUrl}" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This link will expire in 1 hour for security reasons.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you didn't request this password reset, please ignore this email or contact our support team immediately.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin: 0;">
            Best regards,<br>
            The Edu Tech Team
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2025 Edu Tech. All rights reserved.</p>
          <p style="margin: 10px 0 0 0;">Contact: +91 76720 39975 | edutech956@gmail.com</p>
        </div>
      </div>
    `
  }),
  
  projectOrder: (data) => {
    // If data.files or data.documents, build download links
    let filesSection = '';
    if (Array.isArray(data.files) && data.files.length) {
      filesSection = `<div style="margin: 20px 0;"><h4 style="margin:0 0 8px 0;">Project Files:</h4>${data.files.map(f => `<a href="${getDownloadUrl(f.url || f.path, f.originalname || f.filename)}" style="color: #667eea; text-decoration: underline;" download>${f.originalname || f.filename}</a>`).join('<br/>')}</div>`;
    }
    if (Array.isArray(data.documents) && data.documents.length) {
      filesSection += `<div style="margin: 20px 0;"><h4 style="margin:0 0 8px 0;">Documents:</h4>${data.documents.map(f => `<a href="${getDownloadUrl(f.url || f.path, f.originalname || f.filename)}" style="color: #667eea; text-decoration: underline;" download>${f.originalname || f.filename}</a>`).join('<br/>')}</div>`;
    }
    return {
      subject: 'Project Order Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your project is being prepared</p>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${data.customerName}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for your order! We're excited to help you with your academic project.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Order Details:</h3>
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Project:</strong> ${data.projectTitle}</p>
              <p><strong>Amount:</strong> ₹${data.amount}</p>
              <p><strong>Order Date:</strong> ${data.orderDate}</p>
            </div>
            ${filesSection}
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Our team will start working on your project immediately. You'll receive updates on the progress.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/dashboard/orders/${data.orderId}" style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                View Order
              </a>
            </div>
            <p style="color: #666; line-height: 1.6; margin: 0;">
              If you have any questions, contact us at +91 7672039975
            </p>
          </div>
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 Edu Tech. All rights reserved.</p>
            <p style="margin: 10px 0 0 0;">Contact: +91 76720 39975 | edutech956@gmail.com</p>
          </div>
        </div>
      `
    };
  },
  
  projectUpdate: (data) => ({
    subject: 'Project Update Available',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Project Update!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your project has been updated</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${data.customerName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Great news! Your project has been updated with new content and improvements.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Update Details:</h3>
            <p><strong>Project:</strong> ${data.projectTitle}</p>
            <p><strong>Update Type:</strong> ${data.updateType}</p>
            <p><strong>Update Date:</strong> ${data.updateDate}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/projects/${data.projectId}" style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View Updates
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin: 0;">
            Thank you for choosing Edu Tech!
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2025 Edu Tech. All rights reserved.</p>
          <p style="margin: 10px 0 0 0;">Contact: +91 76720 39975 | edutech956@gmail.com</p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    // Get template if template name is provided
    let emailContent = options;
    if (options.template && emailTemplates[options.template]) {
      const template = emailTemplates[options.template](options.data);
      console.log('[EMAIL DEBUG] Generated template HTML:', template.html);
      emailContent = {
        ...options,
        subject: template.subject,
        html: template.html
      };
    }
    // Fallback plain text if html is missing
    const fallbackText = emailContent.text || (emailContent.html ? 'Please view this email in an HTML-compatible client.' : 'Password reset requested.');
    const mailOptions = {
      from: `"Edu Tech" <${process.env.SMTP_USER}>`,
      to: emailContent.email,
      subject: emailContent.subject,
      text: fallbackText,
      html: emailContent.html || ''
    };
    console.log('[EMAIL DEBUG] Sending mail with options:', mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL DEBUG] Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('[EMAIL DEBUG] Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

// Send bulk email function
const sendBulkEmail = async (emails, options) => {
  try {
    const transporter = createTransporter();
    const results = [];
    
    for (const email of emails) {
      try {
        const mailOptions = {
          from: `"Edu Tech" <${process.env.SMTP_USER}>`,
          to: email,
          subject: options.subject,
          text: options.text || '',
          html: options.html || ''
        };
        
        const info = await transporter.sendMail(mailOptions);
        results.push({ email, success: true, messageId: info.messageId });
      } catch (error) {
        results.push({ email, success: false, error: error.message });
      }
    }
    
    return results;
    
  } catch (error) {
    console.error('Bulk email sending failed:', error);
    throw new Error('Bulk emails could not be sent');
  }
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  emailTemplates
}; 
