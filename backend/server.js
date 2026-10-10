
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let scrapedData;

app.get("/", (req, res) => {
  res.json({ message: "Web Scraper API is running!" });
});

app.get("/api/scrapes", async (req, res) => {
  try {
    const records = await scrapedData
      .find()
      .sort({ scrapedDate: -1 })
      .toArray();

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch records" });
  }
});

app.get("/api/scrapes/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid record ID" });
    }

    const record = await scrapedData.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch record" });
  }
});

app.post("/api/scrapes", async (req, res) => {
  try {
    const { url, pageTitle, headings, links, products } = req.body;

    if (
      typeof url !== "string" ||
      !/^https?:\/\//i.test(url) ||
      typeof pageTitle !== "string" ||
      !Array.isArray(headings) ||
      !Array.isArray(links)
    ) {
      return res.status(400).json({
        message: "Provide a valid URL, title, headings and links",
      });
    }

    const record = {
      url,
      pageTitle,
      scrapedDate: new Date(),
      headings,
      links,
      products: Array.isArray(products) ? products : [],
    };

    const result = await scrapedData.insertOne(record);

    res.status(201).json({
      message: "Record saved successfully",
      record: { _id: result.insertedId, ...record },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save record" });
  }
});

async function startServer() {
  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME);
    scrapedData = db.collection("scraped_data");

    await db.command({ ping: 1 });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log("MongoDB connected successfully!");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
