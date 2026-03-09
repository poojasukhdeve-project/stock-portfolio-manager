const express = require("express");
const Portfolio = require("../models/Portfolio");
const Stock = require("../models/Stock");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/*
============================================
BUY STOCK (Investor Only)
============================================
*/
router.post("/", protect, async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const investedAmount = stock.currentPrice * quantity;

    const portfolioEntry = await Portfolio.create({
      user: req.user.id,
      stock: stock._id,
      quantity,
      investedAmount
    });

    res.status(201).json(portfolioEntry);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= SELL STOCK =================
router.post("/sell", protect, async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    // 1️⃣ Find stock
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    // 2️⃣ Find portfolio entry
    const portfolioItem = await Portfolio.findOne({
      user: req.user.id,
      stock: stockId
    });

    if (!portfolioItem) {
      return res.status(404).json({ message: "You do not own this stock" });
    }

    // 3️⃣ Check quantity
    if (quantity > portfolioItem.quantity) {
      return res.status(400).json({ message: "Not enough stock to sell" });
    }

    // 4️⃣ Calculate sell value
    const sellAmount = quantity * stock.currentPrice;

    // Reduce quantity
    portfolioItem.quantity -= quantity;

    // Reduce invested amount proportionally
    const avgPrice =
      portfolioItem.investedAmount / (portfolioItem.quantity + quantity);

    portfolioItem.investedAmount -= avgPrice * quantity;

    // 5️⃣ If quantity becomes 0 → delete
    if (portfolioItem.quantity === 0) {
      await portfolioItem.deleteOne();
      return res.json({ message: "Stock fully sold" });
    }

    await portfolioItem.save();

    res.json({
      message: "Stock sold successfully",
      remainingQuantity: portfolioItem.quantity,
      remainingInvestment: portfolioItem.investedAmount,
      sellAmount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= GET MY PORTFOLIO =================
router.get("/", protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ user: req.user.id })
      .populate("stock");

    let totalInvested = 0;
    let totalCurrentValue = 0;

    portfolio.forEach(item => {
      totalInvested += item.investedAmount;
      totalCurrentValue += item.stock.currentPrice * item.quantity;
    });

    const profitLoss = totalCurrentValue - totalInvested;

    res.json({
      portfolio,
      summary: {
        totalInvested,
        totalCurrentValue,
        profitLoss
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
