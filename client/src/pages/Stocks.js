import { useEffect, useState } from "react";
import API from "../services/api";

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ================= FETCH STOCKS =================
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await API.get("/stocks");
        setStocks(res.data);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        setErrorMessage("Failed to load stocks");
      }
    };

    fetchStocks();
  }, []);

  // ================= HANDLE QUANTITY CHANGE =================
  const handleQuantityChange = (stockId, value) => {
    setQuantities({
      ...quantities,
      [stockId]: value
    });
  };

  // ================= BUY STOCK =================
  const handleBuy = async (stockId) => {
    setMessage("");
    setErrorMessage("");

    const quantity = Number(quantities[stockId]);

    if (!quantity || quantity <= 0) {
      setErrorMessage("Enter a valid quantity");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Please login again");
      return;
    }

    try {
      await API.post("/portfolio", {
        stockId,
        quantity
      });

      setMessage("Stock purchased successfully!");
      setQuantities({ ...quantities, [stockId]: "" });

    } catch (error) {
      console.error("Buy error:", error.response?.data || error.message);

      setErrorMessage(
        error.response?.data?.message || "Failed to buy stock"
      );
    }
  };

  return (
    <div style={styles.container}>
      <h2>Available Stocks</h2>

      {message && <p style={styles.success}>{message}</p>}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      {stocks.map((stock) => (
        <div key={stock._id} style={styles.card}>
          <h3>{stock.symbol}</h3>
          <p>{stock.companyName}</p>
          <p>Sector: {stock.sector}</p>
          <p>Price: ${stock.currentPrice}</p>

          <div style={styles.actions}>
            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={quantities[stock._id] || ""}
              onChange={(e) =>
                handleQuantityChange(stock._id, e.target.value)
              }
              style={styles.input}
            />

            <button
              style={styles.button}
              onClick={() => handleBuy(stock._id)}
            >
              Buy
            </button>
          </div>
        </div>
      ))}
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
  button: {
    padding: "6px 12px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  success: {
    color: "green",
    marginBottom: "15px"
  },
  error: {
    color: "red",
    marginBottom: "15px"
  }
};

export default Stocks;


