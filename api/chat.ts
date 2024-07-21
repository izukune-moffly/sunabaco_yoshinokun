import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "質問が必要です。" });
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/engines/davinci-codex/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: question,
            max_tokens: 100,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return res.status(200).json({ answer: data.choices[0].text.trim() });
      } else {
        return res.status(response.status).json({ error: data.error.message });
      }
    } catch (error) {
      return res.status(500).json({ error: "サーバーエラーが発生しました。" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
