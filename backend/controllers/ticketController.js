const Ticket = require('../models/Ticket');
const { sendEmail } = require('../utils/emailHelper');

/**
 * @route   POST /api/tickets
 * @desc    Create a new support ticket
 * @access  Private (User only)
 */
exports.createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const newTicket = new Ticket({
      user: req.user.id,
      subject,
      message
    });

    await newTicket.save();

    // ✅ Send Email Notification to Admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL, // Set admin email in .env
      subject: `New Support Ticket - ${subject}`,
      text: `A new support ticket has been created by ${req.user.email}.\n\nMessage: ${message}`
    });

    return res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (error) {
    console.error('Create Ticket Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
exports.getUserTickets = async (req, res) => {
    try {
      const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });
      return res.status(200).json(tickets);
    } catch (error) {
      console.error('Get User Tickets Error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };

/**
 * @route   GET /api/tickets/all
 * @desc    Get all support tickets (Admin only)
 * @access  Private (Admin)
 */
exports.getAllTickets = async (req, res) => {
    try {
      const tickets = await Ticket.find().populate('user', 'name email').sort({ createdAt: -1 });
      return res.status(200).json(tickets);
    } catch (error) {
      console.error('Get All Tickets Error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };

  /**
 * @route   POST /api/tickets/:id/respond
 * @desc    Add a response to a ticket
 * @access  Private (Admin/User)
 */
exports.respondToTicket = async (req, res) => {
    try {
      const { message } = req.body;
      const ticket = await Ticket.findById(req.params.id);
  
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found.' });
      }
  
      // Add response to ticket
      ticket.responses.push({ sender: req.user.id, message });
  
      // Auto-update status when admin responds
      if (req.user.role === 'admin') {
        ticket.status = 'in progress';
      }
  
      await ticket.save();
  
      // ✅ Send Email Notification to User
      await sendEmail({
        to: ticket.user.email,
        subject: `Support Ticket Update - ${ticket.subject}`,
        text: `Your support ticket has received a new response:\n\n${message}`
      });
  
      return res.status(200).json({ message: 'Response added successfully', ticket });
    } catch (error) {
      console.error('Respond to Ticket Error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
/**
 * @route   PUT /api/tickets/:id/close
 * @desc    Close a support ticket (Admin only)
 * @access  Private (Admin)
 */
exports.closeTicket = async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
  
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found.' });
      }
  
      ticket.status = 'closed';
      await ticket.save();
  
      return res.status(200).json({ message: 'Ticket closed successfully', ticket });
    } catch (error) {
      console.error('Close Ticket Error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
/**
 * @route   PUT /api/tickets/:id/resolve
 * @desc    Mark a ticket as resolved (User/Admin)
 * @access  Private (User/Admin)
 */
exports.resolveTicket = async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
  
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found.' });
      }
  
      // ✅ Allow users to resolve only their own tickets
      if (req.user.role !== 'admin' && ticket.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You can only resolve your own tickets.' });
      }
  
      // ✅ Update status to "resolved"
      ticket.status = 'resolved';
      await ticket.save();
  
      // ✅ Send Email Notification
      await sendEmail({
        to: ticket.user.email,
        subject: `Support Ticket Resolved - ${ticket.subject}`,
        text: `Hello,\n\nYour support ticket has been marked as resolved.\n\nIf you need further assistance, you can reopen the ticket by replying.\n\nThank you!`
      });
  
      return res.status(200).json({ message: 'Ticket marked as resolved.', ticket });
    } catch (error) {
      console.error('Resolve Ticket Error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
      
