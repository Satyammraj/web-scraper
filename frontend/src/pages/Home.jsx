import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.6 4 5.6 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.6-4-9s1.4-6.4 4-9z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...iconProps} strokeWidth="2">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

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
      const response = await fetch("http://localhost:5000/api/scrapes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sampleData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save the result.");
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
    <main className="hm">
      {/* Hero */}
      <section className="hm-hero">
        <div className="hm-copy">
          <span className="hm-eyebrow">Web Data Toolkit</span>

          <h1 className="hm-title">
            See the structure of <em>any</em> website.
          </h1>

          <p className="hm-lead">
            Paste a web address and get its page title, headings and links
            in one clear report. Every result is saved to your history.
          </p>

          <form className="hm-search" onSubmit={handleScrape} noValidate>
            <label htmlFor="website-url" className="hm-sr">
              Website address
            </label>

            <div className={`hm-field ${error ? "is-error" : ""}`}>
              <span className="hm-field-icon"><GlobeIcon /></span>
              <input
                id="website-url"
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                autoComplete="off"
              />
              {url && (
                <button
                  type="button"
                  className="hm-clear"
                  onClick={handleClear}
                >
                  Clear
                </button>
              )}
              <button className="hm-submit" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="hm-spinner"></span>
                    Processing
                  </>
                ) : (
                  <>
                    Scrape <ArrowIcon />
                  </>
                )}
              </button>
            </div>

            {error && <p className="hm-error" role="alert">{error}</p>}
          </form>

          <p className="hm-note">
            Demo mode: results are sample data, not live website content.
          </p>
        </div>

        {/* Sample report preview */}
        <div className="hm-report" aria-hidden="true">
          <div className="hm-report-head">
            <span className="hm-report-label">Sample report</span>
            <span className="hm-report-url">example.com</span>
          </div>

          <div className="hm-report-block">
            <span className="hm-report-key">Page title</span>
            <p>Example Domain | Sample Website</p>
          </div>

          <div className="hm-report-block">
            <span className="hm-report-key">Headings</span>
            <ul>
              <li><b>H1</b> Welcome to example.com</li>
              <li><b>H2</b> About Us</li>
              <li><b>H2</b> Our Services</li>
            </ul>
          </div>

          <div className="hm-report-block">
            <span className="hm-report-key">Links</span>
            <ul>
              <li><b>01</b> /about</li>
              <li><b>02</b> /contact</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="hm-steps">
        <article>
          <span className="hm-step-no">01</span>
          <h3>Enter a URL</h3>
          <p>Start with the website you want to inspect.</p>
        </article>

        <article>
          <span className="hm-step-no">02</span>
          <h3>Review the report</h3>
          <p>Browse headings, links and page details in one view.</p>
        </article>

        <article>
          <span className="hm-step-no">03</span>
          <h3>Return anytime</h3>
          <p>Every result is stored in your History page.</p>
        </article>
      </section>

      {/* About */}
      <section className="hm-about" id="about">
        <div className="hm-about-copy">
          <span className="hm-eyebrow">About</span>
          <h2>About this project</h2>
          <p>
            Web Scraper is a minor project built for CSE 3395. It takes a
            website address and turns it into a structured report covering
            the page title, headings and links.
          </p>
          <p>
            Each report is saved to a database, so you can open the History
            page at any time and revisit earlier results.
          </p>
        </div>

        <dl className="hm-about-list">
          <div>
            <dt>Course</dt>
            <dd>CSE 3395 · Minor Project</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>React, Node.js, Express, MongoDB</dd>
          </div>
          <div>
            <dt>Collects</dt>
            <dd>Page title, headings, links</dd>
          </div>
          <div>
            <dt>Mode</dt>
            <dd>Demo (sample data)</dd>
          </div>
        </dl>
      </section>

      <footer className="hm-footer">
        Web Scraper &nbsp;·&nbsp; Minor Project &nbsp;·&nbsp; CSE 3395
      </footer>
    </main>
  );
}