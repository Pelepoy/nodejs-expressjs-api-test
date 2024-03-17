const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const app = express();
const dotenv = require("dotenv").config();

connectDB();

const port = process.env.PORT || 3000;
app.use(errorHandler)
app.use(express.json());

app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// app.use('/api/contacts', require('./routes/contactRoutes'));



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
