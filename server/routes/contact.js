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
  // Helper to build Cloudinary download URL with fl_attachment and original filename
  function getDownloadUrl(url, originalname) {
    if (!url || !originalname) return url;
    const urlParts = url.split('/upload/');
    if (urlParts.length === 2) {
      return urlParts[0] + '/upload/fl_attachment:' + encodeURIComponent(originalname) + '/' + urlParts[1];
    }
    return url;
  }
  const docFiles = (req.uploads && req.uploads['documents']) ? req.uploads['documents'].map(f => ({ filename: f.originalname || f.public_id, url: getDownloadUrl(f.url, f.originalname || f.public_id) })) : [];
  const imgFiles = (req.uploads && req.uploads['images']) ? req.uploads['images'].map(f => ({ filename: f.originalname || f.public_id, url: getDownloadUrl(f.url, f.originalname || f.public_id) })) : [];
  try {
    await sendEmail({
      email: process.env.CONTACT_RECEIVER_EMAIL || 'edutech956@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 24px 32px;">
            <h2 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 1px;">New Contact Form Submission</h2>
          </div>
          <div style="padding: 32px; background: #fff;">
            <table style="width: 100%; font-size: 16px; color: #333;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; width: 120px;">Name:</td>
                <td style="padding: 8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #667eea; text-decoration: underline;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600;">Phone:</td>
                <td style="padding: 8px 0;">${phone || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Message:</td>
                <td style="padding: 8px 0; white-space: pre-line;">${message}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Documents:</td>
                <td style="padding: 8px 0; white-space: pre-line;">
                  ${docFiles.length ? docFiles.map(f => `<a href="${f.url}" style="color: #667eea; text-decoration: underline;" download>${f.filename}</a>`).join('<br/>') : 'None'}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Images:</td>
                <td style="padding: 8px 0; white-space: pre-line;">
                  ${imgFiles.length ? imgFiles.map(f => `<a href="${f.url}" style="color: #667eea; text-decoration: underline;" download>${f.filename}</a>`).join('<br/>') : 'None'}
                </td>
              </tr>
            </table>
          </div>
          <div style="background: #f1f1f1; color: #888; text-align: center; font-size: 13px; padding: 16px 32px;">
            <span>Edu Tech &copy; ${new Date().getFullYear()}</span>
          </div>
        </div>
      `
    });
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
