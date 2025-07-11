const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
// <<<<<<< khoi_fe_home_page_product_page
// const app = express();
// =======
const mongoose = require("mongoose");
// >>>>>>> main
// require("dotenv").config();
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// <<<<<<< khoi_fe_home_page_product_page
// const { syncDatabase } = require("./models/mysql/index");

// const port = process.env.PORT || 5000;

// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://localhost:3001"],
//     credentials: true,
//   })
// );

// app.use(bodyParser.json());
// app.use(cookieParser());

// app.use("/api", require("./routes/authRoutes"));
// app.use("/api/orders", require("./routes/orderRoutes"));
// app.use("/api/cart", require("./routes/cartRoutes"));
// app.use("/api/products", require("./routes/productRoutes"));

// app.get("/", (req, res) => res.send("My backend"));

// // Initialize database and then start server
// const startServer = async () => {
//   try {
//     // Sync MySQL database tables
//     console.log("Initializing MySQL database...");
//     await syncDatabase();

//     // Start server after database is initialized
//     app.listen(port, () => console.log(`Server is running on port ${port}`));
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// };

// startServer();
// =======

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
app.use('/api/users', require('./routes/userRoutes'));


app.get('/', (req, res) => res.send('My backend'));

// Server
app.listen(port, () => console.log(`Server is running on port ${port}`));

