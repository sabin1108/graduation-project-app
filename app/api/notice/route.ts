import { NextRequest, NextResponse } from "next/server";

const categoryMap: Record<string, string> = {
  학사: "academic-notices",
  장학: "scholarship-notices",
  일반: "hankyong-notices",
  학생식당: "student-meals",
  교직원식단: "faculty-meals",
  기숙사식단: "dorm-meals",
};

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");

  if (!category || !categoryMap[category]) {
    return NextResponse.json({ error: "유효하지 않은 카테고리입니다." }, { status: 400 });
  }

  const endpoint = categoryMap[category];
  const apiUrl = `http://211.188.57.74:8080/api/${endpoint}/search`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return NextResponse.json({ error: "서버 응답 오류" }, { status: res.status });
    }

    const textData = await res.text();

    // Try to parse as JSON first
    try {
        const jsonData = JSON.parse(textData);
        // If the external API for notices returns { content: [...] }, extract it.
        if (jsonData.content && Array.isArray(jsonData.content)) {
            return NextResponse.json(jsonData.content);
        }
        return NextResponse.json(jsonData);
    } catch (e) {
        // Not JSON, so assume it's a markdown table and parse it.
    }

    // Markdown table parser
    const lines = textData.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      // It was not JSON and not a valid markdown table.
      console.error("Data is not a valid markdown table:", textData);
      return NextResponse.json({ error: "데이터 형식이 올바르지 않습니다." }, { status: 500 });
    }

    const headers = lines[0].split('|').map(header => header.trim()).filter(header => header !== '');
    const dataRows = lines.slice(2);

    const parsedData = dataRows.map(row => {
      const values = row.split('|').map(value => value.trim()).filter(value => value !== '');
      const rowObject: { [key: string]: any } = {};
      headers.forEach((header, index) => {
        rowObject[header] = values[index];
      });
      return rowObject;
    });

    return NextResponse.json(parsedData);
  } catch (err) {
    console.error("프록시 서버 에러:", err);
    return NextResponse.json({ error: "프록시 요청 실패" }, { status: 500 });
  }
}


