export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const { userPrompt, knowledge } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ error: "Missing userPrompt" });
    }

    const entries = knowledge ? JSON.parse(knowledge) : [];
    const kb = entries.map(e => e.type === "qa"
      ? `[Q&A - ${e.department}] Q: ${e.question}\nA: ${e.answer}`
      : `[Bài viết - ${e.department}] Tiêu đề: ${e.title}\n${e.content}`
    ).join("\n\n---\n\n");

    const fullPrompt = `Bạn là trợ lý AI của nhóm LDP Milwaukee. Dưới đây là knowledge base:\n\n${kb}\n\nHãy trả lời câu hỏi dựa trên knowledge base. Nếu không có thông tin, nói rõ. Trả lời bằng tiếng Việt.\n\nCâu hỏi: ${userPrompt}`;

    const apiKey = "AQ.Ab8RN6Iyl3rq5Wj_qbjPBbkj5pE61K2Oe7xm-3CFJJGwRMxNDQ";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Không tìm thấy câu trả lời.";
    return res.status(200).json({ text });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
