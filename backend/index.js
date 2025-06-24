const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI;

// Kết nối MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Kết nối MongoDB thành công!"))
.catch((err) => console.error("Lỗi kết nối MongoDB:", err));

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

app.get('/', (req, res) => res.send('My backend'));

// Server
app.listen(port, () => console.log(`Server is running on port ${port}`));
