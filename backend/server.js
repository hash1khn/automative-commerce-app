// /src/server.js
require('dotenv').config(); // Load .env variables early
const connectDB = require('./config/db.js');
const app = require('./app');

// Connect to database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
