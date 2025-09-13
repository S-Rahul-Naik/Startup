const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/email');
const { handleUploads } = require('../middleware/customUpload');
router.post('/', handleUploads([
  { name: 'documents', maxCount: 10 },
  { name: 'images', maxCount: 10 }
]), async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Please fill all required fields.' });
  }
  // Attachments info (filenames and download links)
  const docFiles = (req.uploads && req.uploads['documents']) ? req.uploads['documents'].map(f => ({ filename: f.originalname || f.public_id, url: f.url })) : [];
  const imgFiles = (req.uploads && req.uploads['images']) ? req.uploads['images'].map(f => ({ filename: f.originalname || f.public_id, url: f.url })) : [];
  res.json({ success: true, message: 'Message sent successfully!' });
  // Send email in the background (non-blocking)
  sendEmail({
    email: process.env.CONTACT_RECEIVER_EMAIL || 'edutech956@gmail.com',
    subject: `Contact Form: ${subject}`,
    html: `
      <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);padding:0 0 24px 0;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="background:#f7f7fa;border-radius:16px 16px 0 0;padding:24px 32px 16px 32px;text-align:center;">
          <img src="https://edutech-2k25.netlify.app/logo.png" alt="EduTech Logo" style="height:40px;margin-bottom:8px;"/>
          <h1 style="margin:0;font-size:1.6rem;color:#3b3b3b;font-weight:700;letter-spacing:1px;">EduTech</h1>
        </div>
        <div style="text-align:center;margin:24px 0 16px 0;">
          <span style="display:inline-block;background:linear-gradient(90deg,#667eea 0%,#764ba2 100%);color:#fff;padding:10px 32px;border-radius:10px;font-size:1.2rem;font-weight:600;">📩 New Contact Request Received</span>
          <div style="margin-top:10px;color:#888;font-size:0.98rem;">Submitted on: ${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
        </div>
        <div style="margin:0 auto 24px auto;max-width:400px;">
          <table style="width:100%;border-collapse:collapse;background:#f7f7fa;border-radius:12px;overflow:hidden;">
            <tr><td style="padding:10px 16px;font-weight:600;color:#444;">Name</td><td style="padding:10px 16px;">${name}</td></tr>
            <tr><td style="padding:10px 16px;font-weight:600;color:#444;">Email</td><td style="padding:10px 16px;"><a href="mailto:${email}" style="color:#667eea;text-decoration:underline;">${email}</a></td></tr>
            <tr><td style="padding:10px 16px;font-weight:600;color:#444;">Phone</td><td style="padding:10px 16px;">${phone ? '+91 ' + phone : '—'}</td></tr>
            <tr><td style="padding:10px 16px;font-weight:600;color:#444;">Message</td><td style="padding:10px 16px;">${message}</td></tr>
            <tr><td style="padding:10px 16px;font-weight:600;color:#444;">Documents</td><td style="padding:10px 16px;">${docFiles.length ? docFiles.map(f => `<a href="${f.url}" style="color:#667eea;text-decoration:underline;" download>${f.filename}</a>`).join('<br/>') : '—'}</td></tr>
            <tr><td style="padding:10px 16px;font-weight:600;color:#444;">Images</td><td style="padding:10px 16px;">${imgFiles.length ? imgFiles.map(f => `<a href="${f.url}" style="color:#667eea;text-decoration:underline;" download>${f.filename}</a>`).join('<br/>') : '—'}</td></tr>
          </table>
        </div>
        <div style="text-align:center;margin-bottom:24px;">
          <a href="mailto:${email}" style="display:inline-block;padding:12px 32px;background:#667eea;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:1rem;margin-right:8px;">Reply to ${name}</a>
          <a href="https://edutech-2k25.netlify.app/admin" style="display:inline-block;padding:12px 32px;background:#764ba2;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:1rem;">Open in Dashboard</a>
        </div>
        <div style="border-top:1px solid #eee;padding:16px 32px 0 32px;text-align:center;font-size:0.95rem;color:#888;">
          Edu Tech &copy; ${new Date().getFullYear()} | <a href="mailto:edutech956@gmail.com" style="color:#667eea;text-decoration:underline;">edutech956@gmail.com</a> | <a href="https://edutech-2k25.netlify.app" style="color:#667eea;text-decoration:underline;">https://edutech-2k25.netlify.app</a>
        </div>
      </div>
    `
  }).catch((err) => console.error('Contact email send error:', err));
});

module.exports = router;
