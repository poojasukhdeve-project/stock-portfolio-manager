const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// GraphQL
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

// GraphQL files
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

// Routes
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");

// Middleware
const protect = require("./middleware/authMiddleware");

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();

// ================= GLOBAL MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= REST ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/portfolio", portfolioRoutes);

app.get("/", (req, res) => {
  res.send("Stock Portfolio API Running 🚀");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

// ================= GRAPHQL SETUP =================
async function startServer() {

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server)
  );

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();