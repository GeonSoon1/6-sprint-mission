import { io } from "socket.io-client";


const BASE_URL = "http://localhost:3000";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY5MjY2OTM5LCJleHAiOjE3NjkzMzg5Mzl9.AaAHQ6va4gJAbVFp0HMTe9uZTdnw3LGGIn-8-89LbrA";

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
