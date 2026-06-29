// api/generate.js
import { GoogleGenAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Chỉ cho phép phương thức POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userPrompt } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ error: "Missing userPrompt in request body" });
    }

    // 1. Khởi tạo GoogleGenAI với API Key mới của bạn
    const apiKey = "AQ.Ab8RN6Iyl3rq5Wj_qbjPBbkj5pE61K2Oe7xm-3CFJJGwRMxNDQ";
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // 2. Sử dụng model gemini-2.0-flash theo bộ SDK mới
    // Gọi qua namespace models.generateContent đúng tiêu chuẩn Interactions API
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: userPrompt,
    });

    // 3. Trả kết quả text về cho Client
    return res.status(200).json({ text: response.text });
  } catch (error) {
    console.error("Vercel Serverless Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}