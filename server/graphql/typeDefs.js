const typeDefs = `#graphql
  type Stock {
    id: ID!
    symbol: String!
    companyName: String!
    sector: String!
    currentPrice: Float!
  }

  type PortfolioItem {
    id: ID!
    quantity: Int!
    investedAmount: Float!
    stock: Stock!
  }

  type PortfolioSummary {
    totalInvested: Float!
    totalCurrentValue: Float!
    profitLoss: Float!
  }

  type PortfolioResponse {
    portfolio: [PortfolioItem]
    summary: PortfolioSummary
  }

  type Query {
    stocks: [Stock]
    myPortfolio: PortfolioResponse
  }

  type Mutation {
    addStock(
      symbol: String!
      companyName: String!
      sector: String!
      currentPrice: Float!
    ): Stock
  }
`;

module.exports = typeDefs;