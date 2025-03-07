/**
 * Payment Simulation Module
 * Supports Credit Card, PayPal and UPI payment methods
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
 * Simulates PayPal payment processing
 * @param {Object} paypalDetails - PayPal account information
 * @param {String} paypalDetails.email - User's PayPal email
 * @param {String} paypalDetails.token - Authentication token (simulated)
 * @param {Number} amount - Order total amount
 * @returns {Object} Payment response with transaction details
 */
exports.simulatePayPalPayment = (paypalDetails, amount) => {
  const { email, token } = paypalDetails;
  
  // Validate required fields
  if (!email || !token) {
    return { 
      success: false, 
      message: "Missing PayPal account information.",
      errorCode: "MISSING_FIELDS"
    };
  }
  
  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { 
      success: false, 
      message: "Invalid email format.",
      errorCode: "INVALID_EMAIL"
    };
  }
  
  // Token validation (simulated)
  if (token.length < 10) {
    return { 
      success: false, 
      message: "Invalid authentication token.",
      errorCode: "INVALID_TOKEN"
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
  
  // Simulate random processing issues (5% chance)
  if (Math.random() < 0.05) {
    return { 
      success: false, 
      message: "PayPal processing error. Please try again.",
      errorCode: "PAYPAL_ERROR"
    };
  }
  
  // Generate a transaction ID
  const transactionId = "PP_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  
  // If everything is valid, simulate a successful payment
  return { 
    success: true, 
    message: "PayPal payment successful.", 
    transactionId: transactionId,
    paymentMethod: "PayPal",
    email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"), // Mask email for privacy
    amount: amount,
    currency: "USD",
    timestamp: new Date().toISOString()
  };
};

/**
 * Simulates UPI payment processing
 * @param {Object} upiDetails - UPI account information
 * @param {String} upiDetails.upiId - User's UPI ID (e.g., name@upi)
 * @param {String} upiDetails.pin - UPI PIN (simulated)
 * @param {Number} amount - Order total amount
 * @returns {Object} Payment response with transaction details
 */
exports.simulateUPIPayment = (upiDetails, amount) => {
  const { upiId, pin } = upiDetails;
  
  // Validate required fields
  if (!upiId || !pin) {
    return { 
      success: false, 
      message: "Missing UPI information.",
      errorCode: "MISSING_FIELDS"
    };
  }
  
  // Basic UPI ID validation
  if (!/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(upiId)) {
    return { 
      success: false, 
      message: "Invalid UPI ID format.",
      errorCode: "INVALID_UPI_ID"
    };
  }
  
  // PIN validation (simulated)
  if (!/^\d{4,6}$/.test(pin)) {
    return { 
      success: false, 
      message: "Invalid UPI PIN.",
      errorCode: "INVALID_PIN"
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
  
  // Simulate network issues (8% chance)
  if (Math.random() < 0.08) {
    return { 
      success: false, 
      message: "UPI network timeout. Please try again.",
      errorCode: "UPI_TIMEOUT"
    };
  }
  
  // Generate a transaction ID and reference number
  const transactionId = "UPI_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  const referenceNumber = "REF" + Math.floor(Math.random() * 10000000000);
  
  // If everything is valid, simulate a successful payment
  return { 
    success: true, 
    message: "UPI payment successful.", 
    transactionId: transactionId,
    referenceNumber: referenceNumber,
    paymentMethod: "UPI",
    upiId: upiId,
    amount: amount,
    currency: "INR",
    timestamp: new Date().toISOString()
  };
};

/**
 * Process payment using any of the supported methods
 * @param {String} paymentMethod - Payment method (card, paypal, upi)
 * @param {Object} paymentDetails - Payment details specific to the method
 * @param {Number} amount - Order total amount
 * @returns {Object} Payment response
 */
exports.processPayment = (paymentMethod, paymentDetails, amount) => {
  switch(paymentMethod.toLowerCase()) {
    case 'card':
      return exports.simulateCardPayment(paymentDetails, amount);
    case 'paypal':
      return exports.simulatePayPalPayment(paymentDetails, amount);
    case 'upi':
      return exports.simulateUPIPayment(paymentDetails, amount);
    default:
      return {
        success: false,
        message: "Unsupported payment method.",
        errorCode: "INVALID_METHOD"
      };
  }
};