import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const ai = new GoogleGenAI({}); // auto loads GEMINI_API_KEY

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    // ⭐ Extract text EXACTLY from your SDK response
    const reply =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No valid response from Gemini.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("🔥 GEMINI API ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
