import { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "Investor";

  const fetchPortfolio = async () => {
    try {
      setLoading(true);

      const res = await API.get("/portfolio");

      setSummary(res.data.summary || {});
      setPortfolio(res.data.portfolio || []);
    } catch (error) {
      console.error("Error fetching portfolio", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (loading) {
    return <h3 style={{ padding: "30px" }}>Loading dashboard...</h3>;
  }

  return (
    <div style={styles.container}>
      
      {/* Welcome */}
      <div style={styles.welcomeBox}>
        <h1 style={{ marginBottom: "5px" }}>
          Welcome back, {userName} 👋
        </h1>
        <p style={{ color: "#555" }}>
          Here’s your portfolio overview for today.
        </p>
      </div>

      {summary ? (
        <>
          {/* SUMMARY CARDS */}
          <div style={styles.cardContainer}>
            
            <div style={styles.card}>
              <h3>Total Invested</h3>
              <p style={styles.amount}>
                ${summary?.totalInvested || 0}
              </p>
            </div>

            <div style={styles.card}>
              <h3>Current Value</h3>
              <p style={styles.amount}>
                ${summary?.totalCurrentValue || 0}
              </p>
            </div>

            <div style={styles.card}>
              <h3>Profit / Loss</h3>

              <p
                style={{
                  ...styles.amount,
                  color:
                    (summary?.profitLoss || 0) >= 0
                      ? "green"
                      : "crimson"
                }}
              >
                ${summary?.profitLoss || 0}
              </p>

              <p style={styles.returnText}>
                {summary?.totalInvested > 0
                  ? (
                      (summary.profitLoss /
                        summary.totalInvested) *
                      100
                    ).toFixed(2)
                  : 0}
                % return
              </p>
            </div>

          </div>

          {/* HOLDINGS TABLE */}
          <div style={styles.tableCard}>
            <h3>Your Holdings</h3>

            {portfolio.length === 0 ? (
              <p>No investments yet.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Quantity</th>
                    <th style={styles.th}>Invested</th>
                    <th style={styles.th}>Current Value</th>
                    <th style={styles.th}>Profit / Loss</th>
                  </tr>
                </thead>

                <tbody>
                  {portfolio.map((item) => {

                    // Prevent crash if stock not populated
                    if (!item?.stock) return null;

                    const currentPrice =
                      item.stock?.currentPrice || 0;

                    const currentValue =
                      currentPrice * item.quantity;

                    const profit =
                      currentValue - item.investedAmount;

                    return (
                      <tr key={item._id}>
                        
                        <td style={styles.td}>
                          {item.stock?.symbol}
                        </td>

                        <td style={styles.td}>
                          {item.quantity}
                        </td>

                        <td style={styles.td}>
                          ${item.investedAmount}
                        </td>

                        <td style={styles.td}>
                          ${currentValue}
                        </td>

                        <td
                          style={{
                            ...styles.td,
                            color:
                              profit >= 0
                                ? "green"
                                : "crimson",
                            fontWeight: "bold"
                          }}
                        >
                          ${profit}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* REFRESH BUTTON */}
          <button
            style={styles.refreshButton}
            onClick={fetchPortfolio}
          >
            Refresh Data
          </button>
        </>
      ) : (
        <p>No portfolio data yet.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f4f6f8",
    minHeight: "90vh"
  },

  welcomeBox: {
    marginBottom: "20px"
  },

  cardContainer: {
    display: "flex",
    gap: "20px",
    marginTop: "20px"
  },

  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center"
  },

  amount: {
    fontSize: "22px",
    fontWeight: "bold"
  },

  returnText: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#555"
  },

  tableCard: {
    marginTop: "30px",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px"
  },

  th: {
    backgroundColor: "#f1f3f5",
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd"
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee"
  },

  refreshButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default Dashboard;

