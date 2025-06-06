import { NextRequest, NextResponse } from "next/server";

const categoryMap: Record<string, string> = {
  학사: "academic-notices",
  장학: "scholarship-notices",
  일반: "hankyong-notices",
  학사일정: "academic-schedule",
  학생식단: "student-meals",
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

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("프록시 서버 에러:", err);
    return NextResponse.json({ error: "프록시 요청 실패" }, { status: 500 });
  }
}


