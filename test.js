const https = require("https");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

https.get("https://www.hknu.ac.kr/web/www/52", (res) => {
  console.log("✅ 상태 코드:", res.statusCode);
}).on("error", (err) => {
  console.error("❌ 요청 실패:", err.message);
});
