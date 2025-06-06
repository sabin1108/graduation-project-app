export async function getNotice(category: string): Promise<string> {
  try {
    const res = await fetch(`/api/notice?category=${category}`, {
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error(`서버 응답 오류: ${res.status} ${res.statusText}`);
      return "공지사항 서버 응답에 문제가 발생했습니다.";
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return `${category} 공지를 찾을 수 없습니다.`;
    }

    const latest = data.slice(0, 3).map((item: any, idx: number) => {
      const title = item?.title ?? "제목 없음";

      // noticeDate를 우선적으로 체크하도록 수정
      const date = item?.noticeDate 
                ?? item?.date 
                ?? item?.regDate 
                ?? item?.createdAt 
                ?? item?.postedAt 
                ?? "날짜 없음";

      const url = item?.url ? `\n${item.url}` : "";

      return `${idx + 1}. ${title} (${date})${url}`;
    });

    return `${category} 최신 3건입니다:\n\n${latest.join("\n\n")}`;
  } catch (error) {
    console.error("공지사항 불러오기 오류:", error);
    return "공지사항을 불러오는 중 오류가 발생했습니다.";
  }
}

export async function getMenuForCategory(category: string): Promise<{ date: string; time: string; menu: string[] }[]> {
  try {
    const res = await fetch(`/api/notice?category=${encodeURIComponent(category)}`, {
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error(`서버 응답 오류: ${res.status} ${res.statusText}`);
      throw new Error("식단 서버 응답 오류");
    }

    const data = await res.json();
    console.log("API 응답 데이터:", data);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("식단 데이터가 없습니다.");
    }

    // 유효한 식단만 추출 (id가 10 이하 + 메뉴 유효)
    const filteredData = data
      .filter(item => {
        const isValidId = typeof item.id === "number" && item.id <= 10;
        const menu = item.menu?.trim();
        const isValidMenu = menu && menu !== "등록된 식단내용이(가) 없습니다.";
        return isValidId && isValidMenu;
      })
      .sort((a, b) => {
        const dateA = new Date(a.mealDate ?? a.date ?? 0);
        const dateB = new Date(b.mealDate ?? b.date ?? 0);
        return dateA.getTime() - dateB.getTime(); // 오래된 날짜부터 정렬
      });

    if (filteredData.length === 0) {
      throw new Error("유효한 식단 데이터가 없습니다.");
    }

    // 상위 5개의 식단만 반환
    const meals = filteredData.slice(0, 10).map(item => {
      const menuArray =
        typeof item.menu === "string"
          ? item.menu.split("\n").map((line: string) => line.trim()).filter(Boolean)
          : ["메뉴 정보가 없습니다."];

      const date = item.mealDate || item.date || "날짜 없음";
      const time = item.mealTime || item.time || "시간 없음";

      return {
        date,
        time,
        menu: menuArray,
      };
    });

    return meals;
  } catch (error) {
    console.error("식단 불러오기 오류:", error);
    throw error;
  }
}


