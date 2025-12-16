import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' });

export const isFileContentBad = async (fileContent: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: `You are a content safety classifier. Analyze the following file content and determine if it contains harmful, inappropriate, or spammy content.

Respond with ONLY one word:
- "unsafe" if the content is harmful, inappropriate, or spammy
- "safe" if the content is appropriate

File content:
${fileContent}
`,
  });

  const text = response.text ?? '';
  if (text.toLowerCase().startsWith('unsafe')) {
    return true;
  } else {
    return false;
  }
};
