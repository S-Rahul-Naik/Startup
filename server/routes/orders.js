const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

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
const multer = require('multer');
const path = require('path');
const upload = multer({
  dest: path.join(__dirname, '../../uploads/receipts'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

router.post('/', auth, upload.single('receipt'), async (req, res) => {
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

    // Handle receipt file
    let receiptPath = '';
    let receiptOriginalName = '';
    if (req.file) {
      receiptPath = `/uploads/receipts/${req.file.filename}`;
      receiptOriginalName = req.file.originalname;
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
      receipt: receiptPath,
      receiptOriginalName: receiptOriginalName,
      status: 'pending'
    });
    await order.save();
    await order.populate('project', 'title price images');
    res.status(201).json(order);

    // Send order confirmation email with professional styling
  const receiptUrl = req.file ? `${process.env.BACKEND_URL || 'http://localhost:5001'}/download/receipts/${req.file.filename}` : '';
    try {
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
                <span style="color:#888;font-size:14px;">Status</span>
                <span style="color:#22c55e;font-weight:500;font-size:14px;">Successful</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <span style="color:#888;font-size:14px;">Date</span>
                <span style="color:#222;font-size:14px;">${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <span style="color:#888;font-size:14px;">Project</span>
                <span style="color:#222;font-size:14px;">${project.title}</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <span style="color:#888;font-size:14px;">Amount</span>
                <span style="color:#222;font-size:14px;">₹${project.price}</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <span style="color:#888;font-size:14px;">Payment Method</span>
                <span style="color:#222;font-size:14px;">UPI</span>
              </div>
            </div>
            ${receiptUrl ? `<a href="${receiptUrl}" style="display:block;text-align:center;background:#222;color:#fff;text-decoration:none;padding:12px 0;border-radius:8px;font-weight:500;font-size:15px;margin-bottom:16px;">Download Receipt</a>` : ''}
            <p style="color:#666;text-align:center;font-size:14px;margin:0;">Thank you for choosing Edu Tech!<br>We will process your order soon.</p>
          </div>
        `,
        attachments: req.file ? [{
          filename: req.file.originalname,
          path: req.file.path
        }] : []
      });
    } catch (emailErr) {
      console.error('Order email failed:', emailErr);
    }
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
    
    if (!['pending', 'processing', 'completed', 'cancelled', 'refunded'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        notes: notes || '',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('project', 'title price images');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
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
