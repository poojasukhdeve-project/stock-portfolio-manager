const Stock = require("../models/Stock");
const Portfolio = require("../models/Portfolio");

const resolvers = {
  Query: {

    // Get all stocks
    stocks: async () => {
      return await Stock.find();
    },

    // Get portfolio (no auth for now - demo only)
    myPortfolio: async () => {
      const portfolio = await Portfolio.find().populate("stock");

      let totalInvested = 0;
      let totalCurrentValue = 0;

      portfolio.forEach(item => {
        totalInvested += item.investedAmount;
        totalCurrentValue += item.stock.currentPrice * item.quantity;
      });

      return {
        portfolio,
        summary: {
          totalInvested,
          totalCurrentValue,
          profitLoss: totalCurrentValue - totalInvested
        }
      };
    }
  },

  Mutation: {

    // Add stock
    addStock: async (_, args) => {

      const stockExists = await Stock.findOne({
        symbol: args.symbol.toUpperCase()
      });

      if (stockExists) {
        throw new Error("Stock already exists");
      }

      const stock = new Stock({
        ...args,
        symbol: args.symbol.toUpperCase()
      });

      return await stock.save();
    }
  }
};

module.exports = resolvers;

