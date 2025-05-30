const fs = require("fs");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { parsePdfSafely, extractTextFromImage } = require("../utils/fileParser");
const QuestionSet = require("../models/QuestionSet");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "your-gemini-api-key"
);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.upload = multer({ storage });

exports.uploadQuestions = async (req, res) => {
  try {
    const { title, description } = req.body;
    const questionFile = req.files.questionFile[0];
    const answerFile = req.files.answerFile ? req.files.answerFile[0] : null;

    let questionText = "";
    let answerText = "";

    // Extract text from question file
    if (questionFile.mimetype === "application/pdf") {
      questionText = await parsePdfSafely(questionFile.path);
    } else if (questionFile.mimetype.startsWith("image/")) {
      questionText = await extractTextFromImage(
        questionFile.path,
        questionFile.mimetype
      );
    } else {
      questionText = fs.readFileSync(questionFile.path, "utf8");
    }

    // Extract text from answer file if provided
    if (answerFile) {
      if (answerFile.mimetype === "application/pdf") {
        answerText = await parsePdfSafely(answerFile.path);
      } else if (answerFile.mimetype.startsWith("image/")) {
        answerText = await extractTextFromImage(
          answerFile.path,
          answerFile.mimetype
        );
      } else {
        answerText = fs.readFileSync(answerFile.path, "utf8");
      }
    }

    if (!questionText.trim()) {
      throw new Error("No text could be extracted from the question file");
    }

    // Process with Gemini to create structured questions
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Process the following text and create a structured quiz with multiple choice questions.
      
      Questions Text: ${questionText}
      ${answerText ? `Answers Text: ${answerText}` : ""}
      
      Please:
      1. Fix any grammatical errors in the questions
      2. Create 4 multiple choice options (A, B, C, D) for each question
      3. Identify the correct answer
      4. Provide explanations for the correct answers
      5. Return the result in JSON format with this structure:
      
      {
        "questions": [
          {
            "question": "corrected question text",
            "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
            "correctAnswer": "A",
            "explanation": "explanation for the correct answer"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let parsedQuestions;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in Gemini response");

      parsedQuestions = JSON.parse(jsonMatch[0]);

      if (
        !parsedQuestions.questions ||
        !Array.isArray(parsedQuestions.questions)
      ) {
        throw new Error("Invalid question structure in response");
      }

      if (parsedQuestions.questions.length === 0) {
        throw new Error("No questions were generated");
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.log("Gemini response:", responseText);
      throw new Error("Failed to parse questions from AI response");
    }

    const questionSet = new QuestionSet({
      title,
      description,
      teacherId: req.user.userId,
      questions: parsedQuestions.questions,
    });

    await questionSet.save();

    try {
      fs.unlinkSync(questionFile.path);
      if (answerFile) fs.unlinkSync(answerFile.path);
    } catch (cleanupError) {
      console.warn("File cleanup error:", cleanupError.message);
    }

    res.json({
      message: "Questions uploaded successfully",
      questionSet: {
        id: questionSet._id,
        title: questionSet.title,
        description: questionSet.description,
        questionsCount: parsedQuestions.questions.length,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    try {
      if (req.files) {
        if (req.files.questionFile)
          fs.unlinkSync(req.files.questionFile[0].path);
        if (req.files.answerFile) fs.unlinkSync(req.files.answerFile[0].path);
      }
    } catch (cleanupError) {
      console.warn("Error cleanup failed:", cleanupError.message);
    }

    let errorMessage = "Error processing questions";
    if (error.message.includes("PDF")) {
      errorMessage =
        "Error processing PDF file. The file may be corrupted or password-protected.";
    } else if (error.message.includes("extract")) {
      errorMessage = "Could not extract text from the uploaded file.";
    } else if (error.message.includes("parse")) {
      errorMessage = "Could not generate questions from the extracted content.";
    }

    res.status(500).json({
      message: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getQuestionSets = async (req, res) => {
  try {
    const questionSets = await QuestionSet.find()
      .populate("teacherId", "name")
      .select("title description teacherId createdAt questions"); // Select questions to count them

    // Map to include questionsCount and remove full questions array
    const modifiedSets = questionSets.map((set) => ({
      _id: set._id,
      title: set.title,
      description: set.description,
      teacherId: set.teacherId,
      createdAt: set.createdAt,
      questions: set.questions.length,
    }));

    res.json(modifiedSets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getQuestionSet = async (req, res) => {
  try {
    const questionSet = await QuestionSet.findById(req.params.id).populate(
      "teacherId",
      "name"
    );

    if (!questionSet) {
      return res.status(404).json({ message: "Question set not found" });
    }

    res.json(questionSet);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
