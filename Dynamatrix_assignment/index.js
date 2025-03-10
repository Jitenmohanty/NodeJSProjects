import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Claim from "./models/claimSchema.js";

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/**
 * @route GET /claims
 * @desc Fetch all claims
 */
app.get("/claims", async (req, res) => {
  try {
    const claims = await Claim.find();
    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /claims
 * @desc Create a new claim
 */
app.post("/claims", async (req, res) => {
  try {
    const newClaim = new Claim(req.body);
    await newClaim.save();
    res.status(201).json(newClaim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /claims/:id
 * @desc Get claim by ID
 */
app.get("/claims/:id", async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    res.status(200).json(claim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route PUT /claims/:id
 * @desc Update a claim
 */
app.put("/claims/:id", async (req, res) => {
  try {
    const updatedClaim = await Claim.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedClaim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route DELETE /claims/:id
 * @desc Delete a claim
 */
app.delete("/claims/:id", async (req, res) => {
  try {
    await Claim.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Claim deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
