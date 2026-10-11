
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
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
      setError("Please enter a valid restaurant website URL.");
      return;
    }

    setLoading(true);

    // Demonstration data for a restaurant website.
    // The assignment allows sample data instead of live scraping.
    const restaurantName = website.hostname
      .replace(/^www\./, "")
      .split(".")[0]
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    const sampleData = {
      url: website.href,
      pageTitle: `${restaurantName} | Restaurant Information`,
      headings: [
        `Restaurant: ${restaurantName}`,
        "Cuisine: Multi-cuisine",
        "Address: Sample restaurant address",
        "Rating: 4.5/5 (sample)",
        "Opening Hours: 10:00 AM - 10:00 PM (sample)",
        "Menu and Specialties",
      ],
      links: [
        { text: "Restaurant Home", url: website.origin + "/" },
        { text: "Menu", url: website.origin + "/menu" },
        { text: "Contact and Location", url: website.origin + "/contact" },
        { text: "Reservations", url: website.origin + "/reservations" },
      ],
      products: [
        {
          name: "Signature Dish",
          price: "₹299",
          category: "Main Course",
        },
        {
          name: "Chef's Special",
          price: "₹399",
          category: "Specialty",
        },
        {
          name: "Dessert Special",
          price: "₹149",
          category: "Dessert",
        },
      ],
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
      console.error("Restaurant scrape request failed:", error);

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
      <section className="hm-hero">
        <div className="hm-copy">
          <span className="hm-eyebrow">RESTAURANT DATA EXPLORER</span>

          <h1 className="hm-title">
            Discover what's on the <em>menu.</em>
          </h1>

          <p className="hm-lead">
            Enter a restaurant website URL and explore organized information
            about its cuisine, location, menu, and useful links.
            Save your reports and revisit them through History.
          </p>

          <form className="hm-search" onSubmit={handleScrape} noValidate>
            <label htmlFor="website-url" className="hm-sr">
              Restaurant website address
            </label>

            <div className={`hm-field ${error ? "is-error" : ""}`}>
              <span className="hm-field-icon">
                <GlobeIcon />
              </span>

              <input
                id="website-url"
                type="text"
                placeholder="https://restaurant.example"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                autoComplete="url"
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
                    <span className="hm-spinner" />
                    Processing
                  </>
                ) : (
                  <>
                    Explore <ArrowIcon />
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="hm-error" role="alert">
                {error}
              </p>
            )}
          </form>

          <p className="hm-note">
            Demo mode: restaurant details and menu items are sample data,
            not information extracted from the live website.
          </p>
        </div>

        <div className="hm-report" aria-hidden="true">
          <div className="hm-report-head">
            <span className="hm-report-label">RESTAURANT REPORT</span>
            <span className="hm-report-url">sample-restaurant.com</span>
          </div>

          <div className="hm-report-block">
            <span className="hm-report-key">Restaurant</span>
            <p>The Golden Table</p>
          </div>

          <div className="hm-report-block">
            <span className="hm-report-key">Restaurant details</span>
            <ul>
              <li><b>01</b> Multi-cuisine</li>
              <li><b>02</b> Rating: 4.5/5 (sample)</li>
              <li><b>03</b> Opening hours</li>
            </ul>
          </div>

          <div className="hm-report-block">
            <span className="hm-report-key">Sample menu</span>
            <ul>
              <li><b>₹299</b> Signature Dish</li>
              <li><b>₹399</b> Chef's Special</li>
              <li><b>₹149</b> Dessert Special</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hm-steps">
        <article>
          <span className="hm-step-no">01</span>
          <h3>Enter a restaurant URL</h3>
          <p>Provide the website address of the restaurant you want to explore.</p>
        </article>

        <article>
          <span className="hm-step-no">02</span>
          <h3>Explore restaurant details</h3>
          <p>Review sample information about cuisine, location, menu, and links.</p>
        </article>

        <article>
          <span className="hm-step-no">03</span>
          <h3>Save and revisit</h3>
          <p>Records are saved in MongoDB and can be revisited through History.</p>
        </article>
      </section>

      <section className="hm-about" id="about">
        <div className="hm-about-copy">
          <span className="hm-eyebrow">ABOUT THE PROJECT</span>
          <h2>A closer look at restaurant websites.</h2>
          <p>
            Restaurant Web Scraper is a CSE 3395 minor project that
            demonstrates how restaurant website information can be organized
            into a structured report.
          </p>
          <p>
            The application uses React for its interface, Express and Node.js
            for the backend API, and MongoDB for storing and retrieving records.
          </p>
        </div>

        <dl className="hm-about-list">
          <div>
            <dt>Course</dt>
            <dd>CSE 3395 · Minor Project</dd>
          </div>
          <div>
            <dt>Technology</dt>
            <dd>React, Node.js, Express, MongoDB</dd>
          </div>
          <div>
            <dt>Information</dt>
            <dd>Restaurant details, menu items, and links</dd>
          </div>
          <div>
            <dt>Current mode</dt>
            <dd>Demonstration using sample data</dd>
          </div>
        </dl>
      </section>

      <footer className="hm-footer">
        Restaurant Web Scraper · Minor Project · CSE 3395
      </footer>
    </main>
  );
}
