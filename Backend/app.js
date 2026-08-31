require("dotenv").config();

const connectDB = require("./db");
const express = require("express");
const cors = require("cors");

connectDB();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// routes
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend connected successfully"
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});