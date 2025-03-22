import { GoogleGenerativeAI } from "@google/generative-ai";
import BotMessage from "../models/botMessageSchema.js";


// Initialize Gemini with error handling
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in .env file");
  process.exit(1);
}

let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log(genAI);
  //   const models = await genAI.listModels();
  //   console.log(models);
} catch (error) {
  console.error("Error initializing Gemini AI:", error);
  process.exit(1);
}

export const getBotMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const chatHistory = await BotMessage.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ chatHistory });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id; // Get user ID from token

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text }] }],
    });

    const geminiResponse = result.response.text();

    // ✅ Store the message in MongoDB
    const newChat = new BotMessage({
      userId,
      userMessage: text,
      botResponse: geminiResponse,
    });

    await newChat.save(); // Save to DB

    res.status(201).json({
      message: "Response generated",
      data: geminiResponse,
    });
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const clearChatBotMessage = async (req, res) => {
    try {
      const userId = req.user.id;
      await BotMessage.deleteMany({ userId });
  
      res.status(200).json({ message: "Chat history cleared" });
    } catch (error) {
      console.error("Error clearing chat history:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }