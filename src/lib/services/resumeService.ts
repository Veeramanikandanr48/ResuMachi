
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "@/types";

// Always use a named parameter for apiKey and obtain it directly from process.env.API_KEY
const getAiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local");
  }
  return new GoogleGenAI({ apiKey });
};

export const extractProfileFromFile = async (base64Data: string, mimeType: string): Promise<Partial<UserProfile>> => {
  const prompt = `
    Extract all professional information from this resume file and return it in a structured JSON format.
    Focus on:
    1. Personal info (name, email, phone, location, title).
    2. Work experience (company, role, dates, detailed description).
    3. Education (institution, degree, field, date).
    4. Skills (technical and soft).
    5. Projects (name, description).
    6. Certifications (name, issuedBy).

    Return ONLY the JSON. If a field is missing, use an empty string or empty array.
  `;

  // Always use ai.models.generateContent with appropriate model for extraction
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personalInfo: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              location: { type: Type.STRING },
              title: { type: Type.STRING },
              linkedin: { type: Type.STRING },
              website: { type: Type.STRING }
            }
          },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                role: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                current: { type: Type.BOOLEAN },
                description: { type: Type.STRING }
              }
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                institution: { type: Type.STRING },
                degree: { type: Type.STRING },
                field: { type: Type.STRING },
                graduationDate: { type: Type.STRING }
              }
            }
          },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          certifications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                issuedBy: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  try {
    // Correctly accessing the .text property as a getter, not a function call
    const text = response.text?.trim();
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Extraction failed:", error);
    throw new Error("Could not parse the resume. Please try manual entry.");
  }
};
