
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/scrapes";

export default function Results() {
  const { id } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResult() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load result.");
        }

        setResult(data);
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

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <main className="page-container inner-page">
        <p>Loading website results...</p>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="page-container inner-page">
        <section className="empty-state">
          <h2>Unable to load results</h2>
          <p>{error || "Record not found."}</p>
          <Link className="primary-button button-link" to="/history">
            Back to History
          </Link>
        </section>
      </main>
    );
  }

  const headings = result.headings || [];
  const links = result.links || [];

  return (
    <main className="page-container inner-page">
      <Link className="back-link" to="/history">
        ← Back to History
      </Link>

      <div className="page-title-row results-title">
        <div>
          <span className="eyebrow">SCRAPE REPORT</span>
          <h1>Website Details</h1>
          <p>Information saved in your MongoDB database.</p>
        </div>

        <span className="status-pill">Saved record</span>
      </div>

      <section className="summary-grid">
        <article className="summary-card">
          <span>Website URL</span>
          <strong className="break-text">{result.url}</strong>
        </article>

        <article className="summary-card">
          <span>Page title</span>
          <strong>{result.pageTitle}</strong>
        </article>

        <article className="summary-card">
          <span>Date and time</span>
          <strong>
            {new Date(result.scrapedDate).toLocaleString()}
          </strong>
        </article>
      </section>

      <div className="details-grid">
        <section className="table-card detail-card">
          <div className="table-heading">
            <div>
              <h2>Page headings</h2>
              <p>{headings.length} headings</p>
            </div>
          </div>

          {headings.length === 0 ? (
            <p className="demo-note">No headings available.</p>
          ) : (
            <ol className="heading-list">
              {headings.map((heading, index) => (
                <li key={index}>
                  <span>H{index === 0 ? 1 : 2}</span>
                  {heading}
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="table-card detail-card">
          <div className="table-heading">
            <div>
              <h2>Page links</h2>
              <p>{links.length} links</p>
            </div>
          </div>

          {links.length === 0 ? (
            <p className="demo-note">No links available.</p>
          ) : (
            <div className="links-list">
              {links.map((link, index) => (
                <div className="result-link" key={index}>
                  <span>↗</span>
                  <div>
                    <strong>{link.text || "Untitled link"}</strong>
                    <p className="break-text">{link.url || ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <p className="demo-note">
        These are sample website details stored in MongoDB, not content
        fetched from the live website.
      </p>
    </main>
  );
}
