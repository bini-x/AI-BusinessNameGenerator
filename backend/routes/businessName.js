import express from "express";
import Groq from "groq-sdk";
import FavoriteIdea from "../models/FavoriteIdea.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/generateNames", async (req, res) => {
  try {
    const { description, category } = req.body;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `Generate 5 business names that are of category: ${category}, for business with the following description: "${description}". Return only the names as a JSON array of strings, nothing else. Example format: ["Name1", "Name2", "Name3", "Name4", "Name5"]`;

    const result = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    const text = result.choices[0].message.content;

    let names;
    try {
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        names = JSON.parse(jsonMatch[0]);
      } else {
        names = text
          .split("\n")
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())
          .filter((name) => name.length > 0)
          .slice(0, 5);
      }
    } catch (error) {
      console.error("Error parsing Groq response:", error);
      return res
        .status(500)
        .json({ success: false, error: "AI response error" });
    }

    return res.status(200).json({ success: true, data: names });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Server internal problem" });
  }
});

router.post("/favoriteIdea", async (req, res) => {
  try {
    const { description, category, generatedName } = req.body;

    const newFavoriteIdea = new FavoriteIdea({
      description,
      category,
      generatedName,
    });
    await newFavoriteIdea.save();
    return res
      .status(200)
      .json({ success: true, message: "Favorite Idea saved successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

export default router;
