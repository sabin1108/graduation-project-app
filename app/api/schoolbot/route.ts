import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 시스템 프롬프트: 학교 정보 챗봇 + 반말 + 이모지
const systemPrompt = `
너는 한경대학교에 대해 대답해주는 '학교챗봇'이야.
친근한 높임말로 대답해.
영어 질문이 들어와도 반드시 한글로 답변해.
`;

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
  });

  const botReply = completion.choices[0]?.message?.content ?? "응답을 만들지 못했습니다.";
  return NextResponse.json({ text: botReply });
}
