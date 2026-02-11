import request from "supertest";
import app from "../../app.js"; // Express 앱 인스턴스
import Article from "../../types/Article.js";
import { User } from "@prisma/client";

describe("Post API 통합 테스트", () => {
  let accessToken = "";
  let testPostId = 0;

  // 테스트 시작 전 사용자 생성 및 토큰 발급
  beforeAll(async () => {
    // 1. 테스트용 DB 초기화 로직 (필요 시)
    // 2. 로그인하여 토큰 확보
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    accessToken = loginRes.body.accessToken;
  });

  // --- [인증이 필요하지 않은 게시글 API] ---
  describe("GET /articles (공개 API)", () => {
    it("모든 사용자는 게시글 목록을 조회할 수 있어야 한다", async () => {
      const res = await request(app).get("/articles");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("특정 ID의 게시글 상세 정보를 조회할 수 있어야 한다", async () => {
      // 미리 생성된 게시글 ID가 있다고 가정 (testPostId)
      const res = await request(app).get(`/articles/${testPostId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title");
    });
  });

  // --- [인증이 필요한 게시글 API] ---
  describe("POST /articles (인증 필수 API)", () => {
    const newPost = {
      title: "테스트 게시글 제목",
      content: "테스트 게시글 내용입니다.",
    };

    it("인증 토큰이 없으면 401 에러를 반환해야 한다", async () => {
      const res = await request(app).post("/articles").send(newPost);

      expect(res.status).toBe(401);
    });

    it("유효한 토큰이 있으면 게시글을 생성할 수 있어야 한다", async () => {
      const res = await request(app)
        .post("/articles")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(newPost);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe(newPost.title);
      testPostId = res.body.id; // 이후 테스트를 위해 ID 저장
    });
  });
});
