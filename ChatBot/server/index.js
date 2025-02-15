import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cors from "cors";
import systemPrompt from "./promt.js";

dotenv.config();

const app = express();
app.use(express.json());
// Update CORS configuration to be more specific
app.use(cors({
    origin: "http://localhost:5173",  // Be explicit about the origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || "your_secret_key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'lax',  // Add this
            httpOnly: true    // Add this
        }
    })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// User Schema
const userSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    email: String,
    image: String,
    role: {
        type: String,
        enum: ['admin', 'bd', 'hr', 'recruiter'],
        default: 'recruiter'
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// Passport configuration
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            scope: ["profile", "email"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await User.findOne({ googleId: profile.id });
                if (existingUser) {
                    return done(null, existingUser);
                }

                const newUser = await new User({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value
                }).save();

                done(null, newUser);
            } catch (err) {
                done(err);
            }
        }
    )
);

// Existing Message Schema
const messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    response: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: "Not authenticated" });
};

// Auth routes
app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: process.env.CLIENT_URL || "http://localhost:5173/dashboard",
        failureRedirect: process.env.CLIENT_URL || "http://localhost:5173/login"
    })
);

app.get("/auth/user", (req, res) => {
    res.json(req.user || null);
});

app.get("/auth/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: "Error logging out" });
        }
        res.redirect(process.env.CLIENT_URL || "http://localhost:5173");
    });
});

// Initialize Gemini with error handling
if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in .env file");
    process.exit(1);
}

let genAI;
try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (error) {
    console.error("Error initializing Gemini AI:", error);
    process.exit(1);
}

// Database connection
const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected successfully");
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    }
};

// Updated API route with authentication
app.post("/api/send",isAuthenticated, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent({
            contents: [
                { role: "model", parts: [{ text: systemPrompt }] },
                { role: "user", parts: [{ text }] },
            ],
        });

        const geminiResponse = result.response.text();

        // Save to database with user reference
        const newMessage = new Message({
            text,
            response: geminiResponse,
            userId: req.user._id
        });
        await newMessage.save();

        res.status(201).json({
            message: "Response generated",
            data: newMessage,
        });
    } catch (error) {
        console.error("Error processing message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get user's message history
app.get("/api/messages",isAuthenticated, async (req, res) => {
    try {
        const messages = await Message.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Error fetching messages" });
    }
});

app.listen(8000, async () => {
    await dbConnect();
    console.log(`Server connected at port 8000`);
});