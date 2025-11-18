"use server";

import { GoogleGenAI } from "@google/genai";
import { OwnershipType, OwnershipResult, SearchSource } from '@/types/types';

export const analyzeOwnership = async (companyName: string): Promise<OwnershipResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are a corporate ownership investigator. Research the current ownership structure of the company: "${companyName}".
    
    Your STRICT goal is to classify the company into exactly one of these categories:
    - Private Equity Owned
    - Publicly Traded / Chain
    - Family Owned / Private
    - Government Owned
    - Non-Profit
    
    Definitions:
    - Private Equity Owned: Owned by a private equity firm (e.g., Blackstone, KKR, Roark Capital, Thoma Bravo) or investment group.
    - Publicly Traded / Chain: Listed on a stock exchange OR a massive corporate subsidiary that is not PE-owned.
    - Family Owned / Private: Owned by founders, families, or private holding companies (e.g., Aldi Nord, Mars, Chick-fil-A) that are NOT private equity firms.
    
    Instructions:
    1. Use Google Search to find the most recent ownership data.
    2. If a company was recently acquired (e.g., by a PE firm), prioritize the current owner.
    3. Provide a classification and a short explanation.
    4. IMPORTANT: Distinguish carefully between "Private Equity" and "Private Company". A company can be private (like Trader Joe's) without being Private Equity owned.

    Output Format:
    Start your response IMMEDIATELY with the category in bold brackets. Do not add any intro text.
    
    Example:
    **[Private Equity Owned]** ${companyName} was acquired by Roark Capital in 2020...
    
    Example:
    **[Publicly Traded / Chain]** ${companyName} is a publicly traded company listed on the NASDAQ under...
    
    Example:
    **[Family Owned / Private]** ${companyName} is a privately held company owned by the Albrecht family...
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No information found.";
    const sources: SearchSource[] = [];

    // Extract sources from grounding metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            uri: chunk.web.uri,
            title: chunk.web.title,
          });
        }
      });
    }

    // Parse the text to extract category and description
    let category = OwnershipType.UNCLEAR;
    let explanation = text;

    // robust parsing of the category from the start of the string
    const categoryMatch = text.match(/^\s*\*\*?\[(.*?)\]\*\*?/);
    const categoryText = categoryMatch ? categoryMatch[1].toLowerCase() : text.toLowerCase();

    if (categoryText.includes("private equity")) category = OwnershipType.PE_OWNED;
    else if (categoryText.includes("publicly traded") || categoryText.includes("chain")) category = OwnershipType.PUBLIC_CHAIN;
    else if (categoryText.includes("family") || categoryText.includes("private")) category = OwnershipType.FAMILY_PRIVATE;
    else if (categoryText.includes("government")) category = OwnershipType.GOVERNMENT;
    else if (categoryText.includes("non-profit")) category = OwnershipType.NON_PROFIT;

    // Clean up the explanation
    explanation = explanation.replace(/^\s*\*\*?\[.*?\]\*\*?\s*/, '').trim();
    explanation = explanation.replace(/^[-:]\s*/, '');

    // Fallback explanation clean up if model was chatty
    if (explanation.length > 500) {
        explanation = explanation.substring(0, 500) + "...";
    }

    return {
      companyName,
      category,
      explanation,
      sources: sources.slice(0, 4),
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze company ownership. Please try again.");
  }
};
