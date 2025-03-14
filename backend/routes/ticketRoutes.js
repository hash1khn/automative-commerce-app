const express = require('express');
const router = express.Router();
const { authenticateJWT, adminCheck } = require('../middleware/authMiddleware');
const {
  createTicket,
  getUserTickets,
  getAllTickets,
  respondToTicket,
  resolveTicket,
  closeTicket
} = require('../controllers/ticketController');

router.post('/create-ticket', authenticateJWT, createTicket); // Create ticket
router.get('/get-user-tickets', authenticateJWT, getUserTickets); // User gets their tickets
router.get('/all', authenticateJWT, adminCheck, getAllTickets); // Admin gets all tickets
router.post('/:id/respond', authenticateJWT, respondToTicket); // Add response
router.put('/:id/resolve', authenticateJWT, resolveTicket); // Resolve ticket (User/Admin)
router.put('/:id/close', authenticateJWT, adminCheck, closeTicket); // Close ticket (Admin only)

module.exports = router;
