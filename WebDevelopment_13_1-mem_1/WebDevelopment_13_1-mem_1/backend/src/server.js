require("dotenv").config();  // Load .env FIRST — before any other imports
const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 5050;

connectDB();   // establishes connection between application and database

// listens to incoming requests
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});