import { io } from "socket.io-client";


const BASE_URL = "http://localhost:3000";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzY5ODU3OTU3LCJleHAiOjE3Njk5Mjk5NTd9.gmSKDvTg9UuXbnKCZeZC8Uvh3yVOnVHZzsYJCcEA3V0";

// 쿠키로 인증하니까 extraHeaders에 cookie 넣기
const socket = io(BASE_URL, {
  extraHeaders: {
    cookie: `access-token=${ACCESS_TOKEN}`,
  },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("❌ connect_error:", err.message);
});

socket.on("notification:new", (payload) => {
  console.log("🔔 notification:new", payload);
});
