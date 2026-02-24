import express from "express";
import axios from "axios";
import Groq from "groq-sdk";
import FavoriteIdea from "../models/FavoriteIdea.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/generateNames", async (req, res) => {
  try {
    const { description, category } = req.body;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `Generate 5 business names that are of category: ${category}, for business with the following description: "${description}". Return only a JSON object like this: { "names": ["Name1", "Name2", "Name3", "Name4", "Name5"] }`;

    const result = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const { names } = JSON.parse(result.choices[0].message.content);

    const namesWithDomainCheck = [];
    for (const name of names) {
      const domain = `${name
        .toLowerCase()
        .split(" ")
        .join("")
        .replace(/[^a-z0-9]/g, "")}.com`;
      try {
        await axios.get(`https://rdap.verisign.com/com/v1/domain/${domain}`);
        namesWithDomainCheck.push({ name, domain, available: false });
      } catch (error) {
        const available = error.response?.status === 404;
        namesWithDomainCheck.push({ name, domain, available });
      }
    }

    return res.status(200).json({ success: true, data: namesWithDomainCheck });
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
