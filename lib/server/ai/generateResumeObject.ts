import { GoogleGenAI } from '@google/genai';
import { ResumeDataSchema } from '@/lib/resume';
import dedent from 'dedent';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });

export const generateResumeObject = async (resumeText: string) => {
  const startTime = Date.now();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: dedent(`You are an expert resume writer. Generate a resume JSON object from the following resume text. Be professional and concise.

    ## Instructions:

    - If the resume text does not include an 'about' section or specific skills mentioned, please generate appropriate content for these sections based on the context of the resume and based on the job role.
    - For the about section: Create a professional summary that highlights the candidate's experience, expertise, and career objectives.
    - For the skills: Generate a maximum of 10 skills taken from the ones mentioned in the resume text or based on the job role / job title infer some if not present.
    - If the resume doesn't contain the full link to social media website leave the username/link as empty strings to the specific social media websites. The username never contains any space so make sure to only return the full username for the website otherwise don't return it.

    ## Required JSON Schema:
    {
      "header": {
        "name": "string (full name)",
        "shortAbout": "string (short description of profile)",
        "location": "string (City, Country) or empty",
        "contacts": {
          "website": "string or empty",
          "email": "string or empty",
          "phone": "string or empty",
          "twitter": "string (username only) or empty",
          "linkedin": "string (username only) or empty",
          "github": "string (username only) or empty"
        },
        "skills": ["array of skill strings, max 10"]
      },
      "summary": "string (professional summary)",
      "workExperience": [
        {
          "company": "string",
          "link": "string (company website URL)",
          "location": "string (City, Country or Remote/Hybrid)",
          "contract": "string (Full-time/Part-time/Contract)",
          "title": "string (job title)",
          "start": "string (YYYY-MM-DD format)",
          "end": "string (YYYY-MM-DD format) or null if current",
          "description": "string (job description)"
        }
      ],
      "education": [
        {
          "school": "string",
          "degree": "string",
          "start": "string (year)",
          "end": "string (year)"
        }
      ]
    }

    ## Resume text:

    ${resumeText}

    Respond with ONLY valid JSON, no markdown code blocks or extra text.`),
      config: {
        responseMimeType: 'application/json',
      },
    });

    const endTime = Date.now();
    console.log(
      `Generating resume object took ${(endTime - startTime) / 1000} seconds`
    );

    // Parse the JSON response
    const jsonText = response.text ?? '';
    const parsedData = JSON.parse(jsonText);

    // Validate with Zod schema
    const validatedData = ResumeDataSchema.parse(parsedData);

    return validatedData;
  } catch (error) {
    console.warn('Impossible generating resume object', error);
    return undefined;
  }
};
