import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
// Need large payload limit for base64 images
app.use(express.json({ limit: '10mb' }));

const port = process.env.PORT || 5000;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy-key" });

// 1. Carbon Lens (Vision)
app.post('/api/gemini/vision', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy-key") {
      console.warn("Using mock Gemini Vision response.");
      await new Promise(resolve => setTimeout(resolve, 2000));
      return res.json({
        detectedObjects: ["Reusable Coffee Cup", "Cardboard Sleeve", "Plastic Lid"],
        estimatedCarbonImpact: "0.2 kg CO2e",
        sustainabilityRating: "B",
        recommendations: [
          "Switch to a reusable lid or a fully compostable alternative.",
          "Bring your own cup to save 100% of the packaging emissions."
        ]
      });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const prompt = `Analyze this image to determine its environmental impact. 
    Return a JSON object strictly following this schema:
    {
      "detectedObjects": ["string", "string"],
      "estimatedCarbonImpact": "string (e.g. 5.2 kg CO2e)",
      "sustainabilityRating": "string (A, B, C, D, or F)",
      "recommendations": ["string", "string"]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [prompt, { inlineData: { mimeType: "image/jpeg", data: base64Data } }],
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    res.status(500).json({ error: "Failed to process image." });
  }
});

// 2. Screenshot Analyzer
app.post('/api/gemini/screenshot', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy-key") {
      console.warn("Using mock Gemini Screenshot response.");
      await new Promise(resolve => setTimeout(resolve, 2000));
      return res.json({
        products: ["Wireless Headphones", "Fast Charger", "USB-C Cable"],
        carbonScore: "14.5 kg CO2e",
        recommendations: [
          "Choose standard shipping instead of one-day delivery.",
          "Consolidate your items into fewer deliveries."
        ]
      });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const prompt = `Analyze this screenshot of a shopping cart or food delivery. 
    Return a JSON object strictly following this schema:
    {
      "products": ["string", "string"],
      "carbonScore": "string",
      "recommendations": ["string", "string"]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [prompt, { inlineData: { mimeType: "image/jpeg", data: base64Data } }],
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error("Gemini Screenshot Error:", error);
    res.status(500).json({ error: "Failed to process screenshot." });
  }
});

// 3. Decision Navigator
app.post('/api/gemini/decision', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy-key") {
      console.warn("Using mock Gemini Decision response.");
      await new Promise(resolve => setTimeout(resolve, 1500));
      return res.json({
        options: [
          {
            title: "Option 1 (Typical)",
            carbonImpact: "High (5.5 kg CO2e)",
            cost: "$15.00",
            time: "20 mins",
            sustainabilityScore: "C",
            pros: ["Faster"],
            cons: ["Higher emissions"]
          },
          {
            title: "Option 2 (Greener)",
            carbonImpact: "Low (0.8 kg CO2e)",
            cost: "$3.50",
            time: "45 mins",
            sustainabilityScore: "A",
            pros: ["Low emissions", "Cheaper"],
            cons: ["Takes longer"]
          }
        ],
        verdict: "Option 2 is highly recommended if you have the time."
      });
    }

    const prompt = `You are a Green Decision Navigator. A user asks: "${question}".
    Analyze the scenario and provide options.
    Return a JSON object strictly following this schema:
    {
      "options": [
        {
          "title": "string",
          "carbonImpact": "string",
          "cost": "string",
          "time": "string",
          "sustainabilityScore": "string (A, B, C, D, F)",
          "pros": ["string"],
          "cons": ["string"]
        }
      ],
      "verdict": "string"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [prompt],
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error("Gemini Decision Error:", error);
    res.status(500).json({ error: "Failed to process decision." });
  }
});

// 4. Future Story
app.post('/api/gemini/story', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "dummy-key") {
      console.warn("Using mock Gemini Story response.");
      await new Promise(resolve => setTimeout(resolve, 2000));
      return res.json({
        story: "In 2035, your sustainable choices reduced 400 kg of CO₂ and inspired your community. Your digital twin's projection became a reality, proving that individual action is the catalyst for global change.",
        year: 2035
      });
    }

    const prompt = `Write a short, inspiring, personalized future story (around 4 sentences) set in 2035 about sustainable choices.
    Return a JSON object strictly following this schema:
    {
      "story": "string",
      "year": 2035
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [prompt],
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error("Gemini Story Error:", error);
    res.status(500).json({ error: "Failed to generate story." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
