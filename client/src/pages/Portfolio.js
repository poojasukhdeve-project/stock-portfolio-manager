import { useEffect, useState } from "react";
import API from "../services/api";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [summary, setSummary] = useState({});
  const [sellQty, setSellQty] = useState({});
  const [message, setMessage] = useState("");

  const fetchPortfolio = async () => {
    try {
      const res = await API.get("/portfolio");

      setPortfolio(res.data.portfolio || []);
      setSummary(res.data.summary || {});
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // Handle sell quantity change
  const handleSellChange = (stockId, value) => {
    setSellQty({
      ...sellQty,
      [stockId]: value
    });
  };

  // Sell stock
  const handleSell = async (stockId) => {
    const quantity = sellQty[stockId];

    if (!quantity || quantity <= 0) {
      alert("Enter valid quantity");
      return;
    }

    try {
      await API.post("/portfolio/sell", {
        stockId,
        quantity: Number(quantity)
      });

      setMessage("Stock sold successfully!");
      setSellQty({ ...sellQty, [stockId]: "" });

      fetchPortfolio();
    } catch (error) {
      console.error("Sell error:", error);
      alert("Failed to sell stock");
    }
  };

  return (
    <div style={styles.container}>
      <h2>My Portfolio</h2>

      {message && <p style={styles.success}>{message}</p>}

      {portfolio.length === 0 && <p>No portfolio data yet.</p>}

      {portfolio.map((item) => {

        // Prevent crash if stock is null
        if (!item?.stock) return null;

        const stockId = item.stock._id;
        const currentPrice = item.stock?.currentPrice || 0;

        return (
          <div key={item._id} style={styles.card}>
            <h3>{item.stock?.symbol}</h3>

            <p>{item.stock?.companyName}</p>

            <p>Quantity: {item.quantity}</p>

            <p>Invested: ${item.investedAmount}</p>

            <p>Current Price: ${currentPrice}</p>

            <div style={styles.actions}>
              <input
                type="number"
                placeholder="Sell Qty"
                value={sellQty[stockId] || ""}
                onChange={(e) =>
                  handleSellChange(stockId, e.target.value)
                }
                style={styles.input}
              />

              <button
                style={styles.sellButton}
                onClick={() => handleSell(stockId)}
              >
                Sell
              </button>
            </div>
          </div>
        );
      })}

      <div style={styles.summary}>
        <h3>Portfolio Summary</h3>

        <p>Total Invested: ${summary?.totalInvested || 0}</p>

        <p>Total Current Value: ${summary?.totalCurrentValue || 0}</p>

        <p
          style={{
            color:
              summary?.profitLoss > 0
                ? "green"
                : summary?.profitLoss < 0
                ? "red"
                : "black"
          }}
        >
          Profit/Loss: ${summary?.profitLoss || 0}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px"
  },

  card: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },

  input: {
    padding: "5px",
    width: "100px"
  },

  sellButton: {
    padding: "6px 12px",
    backgroundColor: "#d32f2f",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },

  summary: {
    marginTop: "30px",
    padding: "15px",
    borderTop: "2px solid #ccc"
  },

  success: {
    color: "green",
    marginBottom: "15px"
  }
};

export default Portfolio;