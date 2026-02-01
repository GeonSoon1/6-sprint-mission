import { jest } from "@jest/globals";
import request from "supertest";

const register = jest.fn();
const login = jest.fn();

jest.unstable_mockModule("../../services/auth.service.js", () => ({
  register,
  login,
}));

const { default: app } = await import("../../app.js");

describe("Auth API", () => {
  test("POST /auth/register - 회원가입", async () => {
    register.mockResolvedValue({ id: 1, email: "test@example.com", nickname: "nick" });

    const res = await request(app).post("/auth/register").send({
      email: " test@example.com ",
      nickname: " nick ",
      password: "pw12",
    });

    expect(res.status).toBe(201);
    expect(register).toHaveBeenCalledWith({
      email: "test@example.com",
      nickname: "nick",
      password: "pw12",
    });
    expect(res.body).toEqual(expect.objectContaining({ id: 1, email: "test@example.com" }));
  });

  test("POST /auth/login - 로그인(set-cookie 포함)", async () => {
    login.mockResolvedValue({ accessToken: "ACCESS", refreshToken: "REFRESH" });

    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "pw12",
    });

    expect(res.status).toBe(200);

    const setCookie = res.headers["set-cookie"] || [];
    expect(setCookie.join(";")).toContain("access-token=");
    expect(setCookie.join(";")).toContain("refresh-token=");
  });
});
