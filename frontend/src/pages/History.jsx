
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/scrapes";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load history.");
        }

        setHistory(data);
      } catch (err) {
        setError(
          err.message === "Failed to fetch"
            ? "Cannot connect to the backend. Check that the server is running."
            : err.message
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  return (
    <main className="page-container inner-page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">YOUR ACTIVITY</span>
          <h1>Scraping History</h1>
          <p>Previously saved website records from MongoDB.</p>
        </div>

        <Link className="primary-button button-link" to="/">
          + New scrape
        </Link>
      </div>

      <section className="table-card">
        <div className="table-heading">
          <div>
            <h2>Previous websites</h2>
            <p>{history.length} record(s) found</p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading history...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <h3>Unable to load history</h3>
            <p>{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◷</div>
            <h3>No scraping history yet</h3>
            <p>Your saved website records will appear here.</p>
            <Link className="primary-button button-link" to="/">
              Scrape your first website
            </Link>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Website URL</th>
                  <th>Page title</th>
                  <th>Scraped on</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item._id}>
                    <td className="url-cell">{item.url}</td>
                    <td>{item.pageTitle}</td>
                    <td>
                      {new Date(item.scrapedDate).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        className="view-button"
                        to={`/results/${item._id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
