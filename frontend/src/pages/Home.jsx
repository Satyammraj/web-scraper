
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleScrape(event) {
    event.preventDefault();
    setError("");

    let website;

    try {
      website = new URL(url.trim());

      if (!["http:", "https:"].includes(website.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      setError("Please enter a valid website URL.");
      return;
    }

    setLoading(true);

    const sampleData = {
      url: website.href,
      pageTitle: website.hostname + " | Sample Website",
      headings: [
        "Welcome to " + website.hostname,
        "About Us",
        "Our Services",
      ],
      links: [
        { text: "Home", url: website.origin + "/" },
        { text: "About", url: website.origin + "/about" },
        { text: "Contact", url: website.origin + "/contact" },
      ],
      products: [],
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/scrapes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sampleData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save the result."
        );
      }

      navigate(`/results/${data.record._id}`);
    } catch (error) {
      console.error("Scrape request failed:", error);

      setError(
        error.message === "Failed to fetch"
          ? "Cannot connect to the backend. Check that the server is running."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setUrl("");
    setError("");
  }

  return (
    <main className="page-container">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">YOUR WEB DATA TOOLKIT</span>
          <h1>Web Scraper<span>.</span></h1>

          <p>
            Turn website URLs into organized information.
            Explore page titles, headings and links in one place.
          </p>

          <div className="hero-points">
            <span>✓ Simple to use</span>
            <span>✓ Organized results</span>
            <span>✓ History at a glance</span>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>
          <div className="globe">◎</div>

          <div className="code-card">
            <span>WEB DATA</span>
            <div>{"<html>"}</div>
            <div>{"<h1>..."}</div>
            <div>{"<a href>"}</div>
            <div>{"</html>"}</div>
          </div>

          <div className="floating-dot dot-one"></div>
          <div className="floating-dot dot-two"></div>
        </div>
      </section>

      <section className="scrape-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">GET STARTED</span>
            <h2>Enter a website URL</h2>
          </div>
          <span className="url-symbol">↗</span>
        </div>

        <form onSubmit={handleScrape}>
          <label htmlFor="website-url">Website address</label>

          <div className="input-wrap">
            <span>🌐</span>
            <input
              id="website-url"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Processing..." : "⌕ Scrape Website"}
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>

        <p className="demo-note">
          Demo mode: results are sample data, not live website content.
        </p>
      </section>

      <section className="info-grid" id="about">
        <article className="info-card">
          <span className="info-icon">⌕</span>
          <h3>Enter a URL</h3>
          <p>Start with the website you want to inspect.</p>
        </article>

        <article className="info-card">
          <span className="info-icon">▤</span>
          <h3>View the details</h3>
          <p>Explore sample headings, links and page information.</p>
        </article>

        <article className="info-card">
          <span className="info-icon">◷</span>
          <h3>Keep your history</h3>
          <p>Revisit previous results from the History page.</p>
        </article>
      </section>

      <footer className="footer">
        Web Scraper · Minor Project · CSE 3395
      </footer>
    </main>
  );
}
