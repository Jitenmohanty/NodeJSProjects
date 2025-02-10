import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected successfully");
  } catch (error) {
    console.log(error, "Error on DB connection");
    process.exit(1);
  }
};

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  response: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// **🔹 API Route to Handle Messages and Use Gemini API**
app.post("/api/send", async (req, res) => {
  try {
    const { text } = req.body;
    console.log(req.body)

    if (!text) {
      return res.status(400).json({ error: "Text and sender are required" });
    }

    // **🔹 Provide Context to Gemini**
    const systemPrompt = `
    You are an AI assistant specialized in explaining an Applicant Tracking System (ATS) that includes multiple user roles. Your job is to assist users by answering questions about the ATS, its workflows, and user responsibilities.

    ## **Application Overview:**
    This ATS is a system designed for managing job applications, business development, and recruitment processes. It includes multiple user roles with distinct responsibilities.

    ### **User Roles & Responsibilities:**
    1️⃣ **Admin**:
       - Has full access to the ATS.
       - Manages users, settings, and permissions.
       - Can assign tasks, view all reports, and oversee operations.

    2️⃣ **BD (Business Developer)**:
       - Responsible for finding and onboarding new businesses.
       - Adds new job descriptions (JDs) for the businesses.
       - Collaborates with recruiters to fulfill job requirements.

    3️⃣ **Recruiter**:
       - Screens candidates from job portals.
       - Matches candidates with relevant job descriptions.
       - Processes candidates through different hiring stages.

    4️⃣ **Manager**:
       - Supervises both BD and Recruiters.
       - Assigns tasks and monitors performance.
       - Ensures smooth workflow between different teams.

    ### **Workflows:**
    🔹 **Business Development Workflow**:
       - BD finds a company looking to hire.
       - BD adds the company's job description (JD) to the ATS.
       - Recruiters start sourcing candidates for that JD.

    🔹 **Recruitment Workflow**:
       - Recruiters search for candidates based on JDs.
       - They add candidates to the ATS and mark their hiring progress.
       - Candidates go through screening, interviews, and selection stages.

    🔹 **Application Use Cases**:
       - The ATS simplifies recruitment by automating job postings and candidate tracking.
       - Helps BD manage and track potential business clients.
       - Admins and Managers can monitor and optimize team performance.

    ## **Response Guidelines:**
    - Answer based on the given ATS details.
    - Keep responses **clear and concise**.
    - Provide **step-by-step explanations** when needed.
    - If the user asks an **unknown question**, politely inform them that your knowledge is limited to the ATS.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // **🔹 Generate AI Response with Context**
    const result = await model.generateContent({
      contents: [
        { role: "model", parts: [{ text: systemPrompt }] }, // Provide system context
        { role: "user", parts: [{ text }] }, // User's actual question
      ],
    });

    const geminiResponse = result.response.text(); // Get AI's response

    // **🔹 Store Message and Response**
    const newMessage = new Message({ text, response: geminiResponse });
    await newMessage.save();

    res.status(201).json({ message: "Response generated", data: newMessage });
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **🔹 Start the Server**
app.listen(8000, async () => {
  await dbConnect();
  console.log(`Server connected at port 8000`);
});
