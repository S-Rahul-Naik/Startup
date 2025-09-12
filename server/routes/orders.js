// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');
// const Project = require('../models/Project');
// const { auth } = require('../middleware/auth');
// const { sendEmail } = require('../utils/email');
const PDFDocument = require('pdfkit');
const stream = require('stream');
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

// Download invoice as PDF (admin or order owner)
router.get('/:id/invoice', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phone address')
      .populate('project', 'title description deliveryDate');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // --- COLORS & FONTS ---
    const PDFKit = require('pdfkit');
    const path = require('path');
    const doc = new PDFKit({ size: 'A4', margin: 0 });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
      res.send(pdfData);
    });

    const primaryBlue = '#2554c7';
    const green = '#43d17a';
    const lightBg = '#f8f9fa';
    const sectionBg1 = '#f4f7fa';
    const sectionBg2 = '#e9f0ffcc';
    const sectionBg3 = '#e8f8f1cc';
    const statusRefundedBg = '#f8d7da';
    const statusRefundedText = '#842029';
    const amountBoxBorder = '#b3dbb6';
    const amountBoxText = '#0f9d58';
    const white = '#fff';

    // --- HEADER GRADIENT ---
    const headerHeight = 90;
    const pageWidth = doc.page.width;
    const contentMargin = 40;
    const sectionRadius = 14;

    // Draw header gradient
    const gradient = doc.linearGradient(0, 0, pageWidth, 0);
    gradient.stop(0, primaryBlue).stop(1, green);
    doc.save();
    doc.rect(0, 0, pageWidth, headerHeight).fill(gradient);
    doc.restore();

    // --- LOGO & COMPANY INFO ---
    const logoPath = path.join(__dirname, '../../client/public/logo.png');
    let logoY = 22;
    let logoX = contentMargin + 2;
    try {
      doc.image(logoPath, logoX, logoY, { width: 48, height: 48 });
    } catch (e) {
      doc.circle(logoX + 24, logoY + 24, 24).fill('white').stroke(primaryBlue);
      doc.fontSize(24).fillColor(primaryBlue).text('E', logoX + 12, logoY + 12, { width: 24, align: 'center' });
    }
    doc.font('Helvetica-BoldOblique').fontSize(22).fillColor('white').text('EduTech', logoX + 60, logoY + 2, { continued: false });
    doc.font('Helvetica').fontSize(11).fillColor('white').text('Educational Technology Solutions', logoX + 60, logoY + 28);
    doc.font('Helvetica-Bold').fontSize(22).fillColor('white').text('INVOICE', pageWidth - contentMargin - 130, logoY + 2, { width: 130, align: 'right' });
    doc.font('Helvetica-Bold').fontSize(13).fillColor('white').text(`#${order._id.toString().slice(-8).toUpperCase()}`, pageWidth - contentMargin - 130, logoY + 32, { width: 130, align: 'right' });

    // --- ORDER INFO SECTION ---
    let y = headerHeight + 30;
    const section1Bg = '#f6f8fb';
    doc.roundedRect(contentMargin, y, pageWidth - 2 * contentMargin, 90, sectionRadius).fill(section1Bg);
    const sectionPaddingY = 26;
    doc.font('Helvetica-Bold').fontSize(14).fillColor(primaryBlue).text('Order Info', contentMargin + 28, y + sectionPaddingY);
    // Layout variables
    const labelFont = 'Helvetica-Bold';
    const valueFont = 'Helvetica';
    const infoY = y + sectionPaddingY + 32;
    const col1X = contentMargin + 40;
    const col2X = col1X + 220;
    const col3X = col2X + 200;
    // Order ID
    doc.font(labelFont).fontSize(12).fillColor('black').text('Order ID:', col1X, infoY, { continued: true });
    doc.font(valueFont).fontSize(12).text(order._id.toString(), { continued: false });
    // Date
    doc.font(labelFont).fontSize(12).fillColor('black').text('Date:', col2X, infoY, { continued: true });
    doc.font(valueFont).fontSize(12).text(new Date(order.createdAt).toLocaleString(), { continued: false });
    // Status label
    doc.font(labelFont).fontSize(12).fillColor('black').text('Status:', col3X, infoY, { continued: false });
    // Status badge
    let statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
    let statusBg = statusRefundedBg;
    let statusFg = statusRefundedText;
    if (order.status === 'paid' || order.status === 'completed' || order.status === 'delivered') {
      statusBg = '#d1e7dd';
      statusFg = '#0f5132';
    } else if (order.status === 'pending' || order.status === 'processing') {
      statusBg = '#fff3cd';
      statusFg = '#664d03';
    }
    const badgeWidth = 90;
    const badgeHeight = 24;
    const badgeX = col3X + 60;
    const badgeY = infoY - 2;
    doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 7).fill(statusBg);
    doc.font('Helvetica-Bold').fontSize(14).fillColor(statusFg).text(statusText, badgeX, badgeY + 5, { width: badgeWidth, align: 'center' });

    // --- ORDER DETAILS SECTION ---
    y += 110;
    const section2Bg = '#eaf2fb';
    doc.roundedRect(contentMargin, y, pageWidth - 2 * contentMargin, 110, sectionRadius).fill(section2Bg);
    doc.font('Helvetica-Bold').fontSize(13).fillColor(primaryBlue).text('Order Details', contentMargin + 20, y + 18);
    let detailsY = y + 44;
    // Keys bold, values regular, consistent spacing
    doc.font('Helvetica-Bold').fontSize(11).fillColor('black').text('Customer:', contentMargin + 20, detailsY, { continued: true });
    doc.font('Helvetica').fontSize(11).text(`${order.user.firstName} ${order.user.lastName}`, { continued: false });
    doc.font('Helvetica-Bold').fontSize(11).fillColor('black').text('Email:', contentMargin + 200, detailsY, { continued: true });
    doc.font('Helvetica').fontSize(11).text(order.user.email || '', { continued: false });
    doc.font('Helvetica-Bold').fontSize(11).fillColor('black').text('Phone:', contentMargin + 380, detailsY, { continued: true });
    doc.font('Helvetica').fontSize(11).text(order.user.phone || '', { continued: false });
    doc.font('Helvetica-Bold').fontSize(11).fillColor('black').text('Project:', contentMargin + 20, detailsY + 28, { continued: true });
    doc.font('Helvetica').fontSize(11).text(order.project.title || '', { continued: false });
    doc.font('Helvetica-Bold').fontSize(11).fillColor('black').text('Description:', contentMargin + 200, detailsY + 28, { continued: true });
    let desc = order.project.description || '';
    let descFontSize = desc.length > 40 ? 10 : 11;
    doc.font('Helvetica').fontSize(descFontSize).text(desc, contentMargin + 290, detailsY + 28, { width: pageWidth - (contentMargin + 290) - 60 });

    // --- PAYMENT INFO SECTION ---
    y += 130;
    const section3Bg = '#d6f5ea';
    doc.roundedRect(contentMargin, y, pageWidth - 2 * contentMargin, 90, sectionRadius).fill(section3Bg);
    doc.font('Helvetica-Bold').fontSize(13).fillColor(green).text('Payment Info', contentMargin + 20, y + 18);
    let payY = y + 44;
    const amountLabelX = contentMargin + 20;
    const amountLabelY = payY + 10;
    doc.font('Helvetica-Bold').fontSize(12).fillColor('black').text('Amount:', amountLabelX, amountLabelY, { continued: false });
    const amountBoxX = amountLabelX + 75;
    const amountBoxY = payY;
    const amountBoxW = 100;
    const amountBoxH = 36;
    doc.roundedRect(amountBoxX, amountBoxY, amountBoxW, amountBoxH, 7).fillAndStroke('#f8fff8', amountBoxBorder);
    doc.font('Helvetica-Bold').fontSize(18).fillColor(amountBoxText).text(`Rs. ${order.amount}`, amountBoxX, amountBoxY + 9, { width: amountBoxW, align: 'center' });
    let paymentMode = 'UPI';
    const payModeLabelX = amountBoxX + amountBoxW + 50;
    doc.font('Helvetica-Bold').fontSize(12).fillColor('black').text('Payment Mode: ', payModeLabelX, amountLabelY, { continued: true });
    doc.font('Helvetica').fontSize(12).text(paymentMode, { continued: false });

    // --- SUMMARY SECTION ---
    y += 100;
    doc.roundedRect(contentMargin, y, pageWidth - 2 * contentMargin, 70, sectionRadius).fill(lightBg);
    doc.font('Helvetica-Bold').fontSize(12).fillColor(primaryBlue).text('Summary', contentMargin + 20, y + 20);
    doc.font('Helvetica').fontSize(10).fillColor('black').text(`Order Status: ${statusText}`, contentMargin + 20, y + 44, { continued: true }).text(` | Order Date: ${new Date(order.createdAt).toLocaleString()}`, { continued: true }).text(` | Invoice Generated: ${new Date().toLocaleString()}`);

    // --- FOOTER ---
    doc.fontSize(12).fillColor('#555').text('Thank you for your business!', 0, y + 120, { align: 'center' });
    doc.fontSize(11).fillColor('#777').text('EduTech | www.edutech.com', 0, y + 138, { align: 'center' });
    doc.end();
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
});

// Update admin notes (admin only)
router.patch('/:id/admin-notes', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { adminNotes } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.adminNotes = adminNotes;
    await order.save();
    res.json({ adminNotes: order.adminNotes });
  } catch (error) {
    console.error('Error updating admin notes:', error);
    res.status(500).json({ error: 'Failed to update admin notes' });
  }
});


// Get order by ID (admin only, full details)
router.get('/admin/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phone address')
      .populate('project', 'title description deliveryDate')
      .lean();
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    // Optionally, add status history and admin notes if present
    res.json({ order });
  } catch (error) {
    console.error('Error fetching admin order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});


// Get user's orders (authenticated users)
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('project', 'title price images')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID (authenticated users - their own orders only)
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('project', 'title price images description')
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Users can only view their own orders (unless admin)
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create new order (authenticated users, UPI only, with receipt upload and full address)

const { handleUploads } = require('../middleware/customUpload');

// Accepts 'receipt' as a file (image/pdf), stores in Cloudinary, saves URL in order
router.post('/', auth, handleUploads([{ name: 'receipt', maxCount: 1 }]), async (req, res) => {
  try {
    console.log('REQ.BODY:', req.body);
    const { projectId, paymentMethod } = req.body;
    // Only allow UPI
    if (paymentMethod !== 'upi') {
      return res.status(400).json({ message: 'Only UPI payment is allowed' });
    }
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }
    // Check if project exists and is published
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (!project.isPublished) {
      return res.status(400).json({ message: 'Project is not available for purchase' });
    }
    // Check if user already purchased this project
    const existingOrder = await Order.findOne({
      user: req.user.id,
      project: projectId
    });
    if (existingOrder) {
      return res.status(400).json({ message: 'You have already purchased this project' });
    }
    // Parse delivery address fields
    const deliveryAddress = {
      name: req.body['deliveryAddress[name]'] || req.body.name,
      email: req.body['deliveryAddress[email]'] || req.body.email,
      phone: req.body['deliveryAddress[phone]'] || req.body.phone,
      street: req.body['deliveryAddress[street]'] || req.body.street,
      city: req.body['deliveryAddress[city]'] || req.body.city,
      district: req.body['deliveryAddress[district]'] || req.body.district,
      state: req.body['deliveryAddress[state]'] || req.body.state,
      zip: req.body['deliveryAddress[zip]'] || req.body.zip,
      country: req.body['deliveryAddress[country]'] || req.body.country || 'India',
    };
    console.log('DELIVERY ADDRESS:', deliveryAddress);
    // Validate all address fields
    for (const key in deliveryAddress) {
      if (!deliveryAddress[key] || deliveryAddress[key].trim() === '') {
        return res.status(400).json({ message: `Missing address field: ${key}` });
      }
    }

    // Handle receipt file (Cloudinary)
    let receiptUrl = '';
    let receiptOriginalName = '';
    if (req.uploads && req.uploads.receipt && req.uploads.receipt.length > 0) {
      receiptUrl = req.uploads.receipt[0].url;
      receiptOriginalName = req.uploads.receipt[0].originalname || '';
    } else {
      return res.status(400).json({ message: 'Payment receipt is required' });
    }
    // Create order
    const order = new Order({
      user: req.user.id,
      project: projectId,
      amount: project.price,
      paymentMethod: 'upi',
      billingAddress: deliveryAddress,
      receipt: receiptUrl,
      receiptOriginalName: receiptOriginalName,
      status: 'pending'
    });
    await order.save();
    await order.populate('project', 'title price images');
    res.status(201).json(order);

    // Send order confirmation email with professional styling
    try {
      // Send to user
      await sendEmail({
        email: deliveryAddress.email,
        subject: 'Order Confirmation - Edu Tech',
        html: `
          <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);padding:32px 24px;font-family:'Segoe UI',Arial,sans-serif;">
            <div style="text-align:center;margin-bottom:24px;">
              <div style="display:inline-block;background:#e6f9ec;border-radius:50%;padding:16px;margin-bottom:8px;">
                <span style="font-size:32px;color:#22c55e;">&#10003;</span>
              </div>
              <h2 style="margin:0;font-size:1.5rem;color:#222;font-weight:600;">Payment Successful!</h2>
              <p style="color:#666;margin:8px 0 0 0;">We have received your order and payment receipt.</p>
            </div>
            <div style="background:#f7f7fa;border-radius:12px;padding:20px 16px;margin-bottom:24px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <span style="font-weight:600;">Project:</span> <span>${project.title}</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <span style="font-weight:600;">Amount:</span> <span>Rs. ${project.price}</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <span style="font-weight:600;">Order ID:</span> <span>${order._id}</span>
              </div>
            </div>
            <div style="text-align:center;">
              <a href="${receiptUrl}" style="display:inline-block;padding:10px 24px;background:#22c55e;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">View Receipt</a>
            </div>
          </div>
        `
      });
      // Send to company (same template)
      await sendEmail({
        email: 'edutech956@gmail.com',
        subject: 'Order Confirmation - Edu Tech (Copy)',
        html: `
          <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);padding:32px 24px;font-family:'Segoe UI',Arial,sans-serif;">
            <div style="text-align:center;margin-bottom:24px;">
              <div style="display:inline-block;background:#e6f9ec;border-radius:50%;padding:16px;margin-bottom:8px;">
                <span style="font-size:32px;color:#22c55e;">&#10003;</span>
              </div>
              <h2 style="margin:0;font-size:1.5rem;color:#222;font-weight:600;">Payment Successful!</h2>
              <p style="color:#666;margin:8px 0 0 0;">We have received your order and payment receipt.</p>
            </div>
            <div style="background:#f7f7fa;border-radius:12px;padding:20px 16px;margin-bottom:24px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <span style="font-weight:600;">Project:</span> <span>${project.title}</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <span style="font-weight:600;">Amount:</span> <span>Rs. ${project.price}</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <span style="font-weight:600;">Order ID:</span> <span>${order._id}</span>
              </div>
            </div>
            <div style="text-align:center;">
              <a href="${receiptUrl}" style="display:inline-block;padding:10px 24px;background:#22c55e;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">View Receipt</a>
            </div>
          </div>
        `
      });
    } catch (e) {
      console.error('Failed to send order confirmation email:', e);
    }
  // (Removed duplicate/different user email)
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { status, notes } = req.body;
    
  if (!['pending', 'paid', 'processing', 'delivered', 'completed', 'cancelled', 'refunded'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    // Only update if status is actually changing
    if (order.status !== status) {
      order.status = status;
      order.notes = notes || '';
      order.updatedAt = new Date();
      order.statusHistory = order.statusHistory || [];
      order.statusHistory.push({
        status,
        updatedBy: req.user._id,
        updatedAt: new Date()
      });
      await order.save();
    }
    await order.populate('project', 'title price images');
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Cancel order (authenticated users - their own orders only)
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Users can only cancel their own orders
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this order' });
    }
    
    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending orders can be cancelled' });
    }
    
    order.status = 'cancelled';
    order.notes = 'Cancelled by user';
    order.updatedAt = new Date();
    
    await order.save();
    
    res.json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Get all orders (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { page = 1, limit = 20, status, userId } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (userId) query.user = userId;
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('project', 'title price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order statistics (admin only)
router.get('/stats/overview', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    // Calculate total revenue from completed orders
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('status amount createdAt user project');
    
    res.json({
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue: totalRevenue.toFixed(2)
      },
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
});

module.exports = router;
