const fs = require('fs');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key');

const parsePdfSafely = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    
    try {
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (pdfParseError) {
      console.log('pdf-parse failed, trying alternative method:', pdfParseError.message);
      
      try {
        const data = await pdfParse(dataBuffer, {
          normalizeWhitespace: false,
          disableCombineTextItems: true,
          version: 'v1.10.100'
        });
        return data.text;
      } catch (alternativeError) {
        console.log('Alternative pdf-parse also failed:', alternativeError.message);
        
        console.log('Falling back to Gemini Vision API for PDF');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
          "This is a PDF document converted to image. Extract all text content from this image, especially questions and any relevant information. If you see mathematical formulas, convert them to text format:",
          {
            inlineData: {
              data: dataBuffer.toString('base64'),
              mimeType: 'application/pdf'
            }
          }
        ]);
        return result.response.text();
      }
    }
  } catch (error) {
    console.error('Complete PDF processing failed:', error);
    throw new Error(`Failed to process PDF: ${error.message}`);
  }
};

const extractTextFromImage = async (filePath, mimeType) => {
  const imageBuffer = fs.readFileSync(filePath);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    "Extract all text content from this image, especially questions and any relevant information:",
    {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType
      }
    }
  ]);
  return result.response.text();
};

module.exports = { parsePdfSafely, extractTextFromImage };