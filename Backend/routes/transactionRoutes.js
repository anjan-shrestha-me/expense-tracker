const express = require("express");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");
const { body, validationResult } = require("express-validator");
const { createTransaction, getTransactions, updateTransaction, deleteTransaction } = require("../controllers/transactionController");
const router = express.Router();

// CREATE
router.post(
  "/",
  authMiddleware,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("amount")
      .notEmpty()
      .withMessage("Amount is required")
      .isNumeric()
      .withMessage("Amount must be a number"),
    body("type")
      .isIn(["income", "expense", "Income", "Expense"])
      .withMessage("Type must be income or expense"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    next();
  },
  createTransaction
);
// READ
router.get("/", authMiddleware, getTransactions);
// UPDATE
router.put("/:id", authMiddleware, updateTransaction);
// DELETE
router.delete("/:id", authMiddleware, deleteTransaction);
module.exports = router;