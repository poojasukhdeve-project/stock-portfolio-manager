import { useEffect, useState } from "react";
import API from "../services/api";

const Admin = () => {
  const [stock, setStock] = useState({
    symbol: "",
    companyName: "",
    sector: "",
    currentPrice: ""
  });

  const [stocks, setStocks] = useState([]);
  const [updatedPrices, setUpdatedPrices] = useState({});
  const [loading, setLoading] = useState(false);

  // ================= Fetch Stocks =================
  const fetchStocks = async () => {
    try {
      const res = await API.get("/stocks");
      setStocks(res.data);
    } catch (error) {
      console.error("Error fetching stocks", error);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // ================= Add Stock =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stock.symbol || !stock.companyName || !stock.sector || !stock.currentPrice) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/stocks", {
        ...stock,
        currentPrice: Number(stock.currentPrice)
      });

      alert("Stock added successfully");

      setStock({
        symbol: "",
        companyName: "",
        sector: "",
        currentPrice: ""
      });

      fetchStocks();
    } catch (error) {
      alert(error.response?.data?.message || "Error adding stock");
    } finally {
      setLoading(false);
    }
  };

  // ================= Update Stock Price =================
  const handleUpdate = async (id) => {
    const newPrice = updatedPrices[id];

    if (!newPrice || newPrice <= 0) {
      alert("Enter valid price");
      return;
    }

    try {
      await API.put(`/stocks/${id}`, {
        currentPrice: Number(newPrice)
      });

      alert("Stock price updated");
      fetchStocks();
    } catch (error) {
      alert("Error updating stock");
    }
  };

  // ================= Delete Stock =================
  const handleDelete = async (id) => {
    try {
      await API.delete(`/stocks/${id}`);
      alert("Stock deleted");
      fetchStocks();
    } catch (error) {
      alert("Error deleting stock");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Add New Stock</h2>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Symbol"
            value={stock.symbol}
            onChange={(e) => setStock({ ...stock, symbol: e.target.value })}
          />

          <input
            style={styles.input}
            placeholder="Company Name"
            value={stock.companyName}
            onChange={(e) => setStock({ ...stock, companyName: e.target.value })}
          />

          <input
            style={styles.input}
            placeholder="Sector"
            value={stock.sector}
            onChange={(e) => setStock({ ...stock, sector: e.target.value })}
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Current Price"
            value={stock.currentPrice}
            onChange={(e) => setStock({ ...stock, currentPrice: e.target.value })}
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Adding..." : "Add Stock"}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2>All Stocks</h2>

        {stocks.map((s) => (
          <div key={s._id} style={styles.stockRow}>
            <div>
              <strong>{s.symbol}</strong> - {s.companyName} (${s.currentPrice})
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="number"
                placeholder="New Price"
                style={{ width: "100px" }}
                value={updatedPrices[s._id] || ""}
                onChange={(e) =>
                  setUpdatedPrices({
                    ...updatedPrices,
                    [s._id]: e.target.value
                  })
                }
              />

              <button
                style={styles.updateButton}
                onClick={() => handleUpdate(s._id)}
              >
                Update
              </button>

              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(s._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f4f6f8",
    minHeight: "90vh"
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  stockRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #eee"
  },
  updateButton: {
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer"
  },
  deleteButton: {
    backgroundColor: "crimson",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default Admin;