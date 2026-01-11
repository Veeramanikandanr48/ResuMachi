
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Tone, GeneratedResumeResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResume = async (
  profile: UserProfile,
  jobDescription: string,
  tone: Tone = 'Professional',
  conciseness: number = 50,
  targetSection?: string
): Promise<GeneratedResumeResponse> => {
  const prompt = `
    As an AI Resume Architect, generate a highly optimized resume.
    
    USER PROFILE:
    ${JSON.stringify(profile, null, 2)}

    JOB DESCRIPTION:
    ${jobDescription}

    CONSTRAINTS:
    - Tone: ${tone}
    - Conciseness Level: ${conciseness}/100
    - Align strictly with JD keywords.
    - DO NOT fabricate experiences.
    - Optimize for ATS systems.
    - SKILLS: Categorize skills into logical groups (e.g., Languages, Frameworks, Tools).

    Respond ONLY with valid JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          selected_template: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["id", "name", "reason"]
          },
          resume_content: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
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
                    location: { type: Type.STRING },
                    degreeType: { type: Type.STRING },
                    field: { type: Type.STRING },
                    startMonthYear: { type: Type.STRING },
                    gradMonthYear: { type: Type.STRING },
                    scoreType: { type: Type.STRING },
                    scoreValue: { type: Type.STRING }
                  }
                }
              },
              skillCategories: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    items: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["category", "items"]
                }
              },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    technologies: { type: Type.STRING },
                    link: { type: Type.STRING },
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
                    link: { type: Type.STRING },
                    issuedBy: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["summary", "experience", "education", "skillCategories", "projects"]
          },
          ats_score: {
            type: Type.OBJECT,
            properties: {
              overall: { type: Type.NUMBER },
              keyword_match: { type: Type.NUMBER },
              missing_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              sectionScores: {
                type: Type.OBJECT,
                properties: {
                  summary: { type: Type.NUMBER },
                  experience: { type: Type.NUMBER },
                  education: { type: Type.NUMBER },
                  skills: { type: Type.NUMBER },
                  projects: { type: Type.NUMBER }
                },
                required: ["summary", "experience", "education", "skills", "projects"]
              }
            },
            required: ["overall", "keyword_match", "missing_keywords", "sectionScores"]
          },
          optimization_suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          regeneration_options: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["selected_template", "resume_content", "ats_score", "optimization_suggestions", "regeneration_options"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim()) as GeneratedResumeResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid response format from AI engine.");
  }
};
