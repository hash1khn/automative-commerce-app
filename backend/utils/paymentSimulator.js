/**
 * Payment Simulation Module
 * Supports only Credit Card payments
 */

/**
 * Simulates credit card payment processing
 * @param {Object} cardDetails - User's card information
 * @param {String} cardDetails.cardNumber - Card number
 * @param {String} cardDetails.expiryDate - Card expiry date (MM/YY)
 * @param {String} cardDetails.cvv - Card CVV code
 * @param {String} cardDetails.cardHolderName - Name of the card holder
 * @param {Number} amount - Order total amount
 * @returns {Object} Payment response with transaction details
 */
exports.simulateCardPayment = (cardDetails, amount) => {
  const { cardNumber, expiryDate, cvv, cardHolderName } = cardDetails;

  // Validate required fields
  if (!cardNumber || !expiryDate || !cvv || !cardHolderName) {
    return {
      success: false,
      message: "Missing required card information.",
      errorCode: "MISSING_FIELDS"
    };
  }

  // Basic card number validation (Luhn algorithm not implemented for brevity)
  if (!/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
    return {
      success: false,
      message: "Invalid card number format.",
      errorCode: "INVALID_CARD_FORMAT"
    };
  }

  // Card type detection
  let cardType = "Unknown";
  if (cardNumber.startsWith("4")) {
    cardType = "Visa";
  } else if (/^5[1-5]/.test(cardNumber)) {
    cardType = "MasterCard";
  } else if (/^3[47]/.test(cardNumber)) {
    cardType = "American Express";
  } else if (/^6(?:011|5)/.test(cardNumber)) {
    cardType = "Discover";
  }

  // Expiry validation
  const [expMonth, expYear] = expiryDate.split("/").map(part => parseInt(part, 10));
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Get last two digits
  const currentMonth = currentDate.getMonth() + 1; // Jan is 0

  if (isNaN(expMonth) || isNaN(expYear) ||
      expMonth < 1 || expMonth > 12 ||
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)) {
    return {
      success: false,
      message: "Card expired or invalid expiry date.",
      errorCode: "EXPIRED_CARD"
    };
  }

  // CVV validation
  if (!/^\d{3,4}$/.test(cvv)) {
    return {
      success: false,
      message: "Invalid CVV code.",
      errorCode: "INVALID_CVV"
    };
  }

  // Amount validation
  if (isNaN(amount) || amount <= 0) {
    return {
      success: false,
      message: "Invalid payment amount.",
      errorCode: "INVALID_AMOUNT"
    };
  }

  // Simulate random declines (10% chance)
  if (Math.random() < 0.1) {
    return {
      success: false,
      message: "Payment declined by issuing bank.",
      errorCode: "BANK_DECLINED"
    };
  }

  // Generate a transaction ID
  const transactionId = "CARD_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

  // If everything is valid, simulate a successful payment
  return {
    success: true,
    message: "Payment successful.",
    transactionId: transactionId,
    cardType: cardType,
    last4: cardNumber.slice(-4),
    amount: amount,
    currency: "USD",
    timestamp: new Date().toISOString()
  };
};

/**
 * Process payment using card method only
 * @param {String} paymentMethod - Must be "card"
 * @param {Object} paymentDetails - Payment details
 * @param {Number} amount - Order total amount
 * @returns {Object} Payment response
 */
exports.processPayment = (paymentDetails, amount) => {
  return exports.simulateCardPayment(paymentDetails, amount);
};
