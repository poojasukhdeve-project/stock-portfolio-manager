const express = require("express");
const Stock = require("../models/Stock");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

/*
=================================================
CREATE STOCK (ADMIN ONLY)
=================================================
*/
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const { symbol, companyName, sector, currentPrice } = req.body;

    if (!symbol || !companyName || !sector || !currentPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const upperSymbol = symbol.toUpperCase();

    const stockExists = await Stock.findOne({ symbol: upperSymbol });

    if (stockExists) {
      return res.status(400).json({ message: "Stock already exists" });
    }

    const stock = await Stock.create({
      symbol: upperSymbol,
      companyName,
      sector,
      currentPrice: Number(currentPrice)
    });

    res.status(201).json(stock);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/*
=================================================
UPDATE STOCK PRICE (ADMIN ONLY)
=================================================
*/
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { currentPrice } = req.body;

    if (!currentPrice || currentPrice <= 0) {
      return res.status(400).json({ message: "Valid price required" });
    }

    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    stock.currentPrice = Number(currentPrice);

    const updatedStock = await stock.save();

    res.json({
      message: "Stock price updated successfully",
      updatedStock
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/*
=================================================
DELETE STOCK (ADMIN ONLY)
=================================================
*/
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    await stock.deleteOne();

    res.json({ message: "Stock deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/*
=================================================
GET ALL STOCKS (PUBLIC)
=================================================
*/
router.get("/", async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ symbol: 1 });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/*
=================================================
GET STOCK BY SYMBOL
=================================================
*/
router.get("/symbol/:symbol", async (req, res) => {
  try {
    const stock = await Stock.findOne({
      symbol: req.params.symbol.toUpperCase()
    });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.json(stock);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

