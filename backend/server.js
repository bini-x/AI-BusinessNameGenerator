import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import businessName from "./routes/businessName.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", businessName);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Running on port: ${process.env.PORT}`);
});
