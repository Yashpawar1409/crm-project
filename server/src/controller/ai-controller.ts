import { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Temporarily add this to your ai-controller.ts
console.log("Key being used:", process.env.OPENAI_API_KEY?.slice(0, 8) + "...");

interface GenerateMessagesRequest {
  objective: string;
  audienceDescription: string;
}

interface CampaignStats {
  total: number;
  sent: number;
  failed: number;
  deliveryRate: string;
  [key: string]: any; // For additional custom metrics
}

export const generateCampaignMessages = async (req: Request<{}, {}, GenerateMessagesRequest>, res: Response) => {
  const { objective, audienceDescription } = req.body;

  try {
    const prompt = `Generate 3 marketing message variations for a campaign targeting: ${audienceDescription}. Campaign objective: ${objective}. Use a friendly, professional tone. Format as a bulleted list.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "";
    const messages = content
      .split('\n')
      .filter((line: string) => line.trim().startsWith('-'))
      .map((line: string) => line.replace(/^- /, '').trim());

    res.status(200).json({ messages });
  } catch (error) {
    console.error("AI generation error:", error);
    if (error instanceof OpenAI.APIError) {
      res.status(error.status || 500).json({ 
        error: error.message,
        type: error.type
      });
    } else {
      res.status(500).json({ error: "Failed to generate messages" });
    }
  }
};

export const generateCampaignSummary = async (req: Request<{}, {}, { campaignStats: CampaignStats }>, res: Response) => {
  const { campaignStats } = req.body;

  try {
    const prompt = `Create a concise, insightful summary of these campaign stats in 1-2 sentences: ${JSON.stringify(campaignStats)}. Highlight key metrics and any notable patterns. Use a professional but friendly tone.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.5,
    });

    const summary = response.choices[0]?.message?.content?.trim() || "No summary generated";
    res.status(200).json({ summary });
  } catch (error) {
    console.error("AI summarization error:", error);
    if (error instanceof OpenAI.APIError) {
      res.status(error.status || 500).json({ 
        error: error.message,
        type: error.type
      });
    } else {
      res.status(500).json({ error: "Failed to generate summary" });
    }
  }
};