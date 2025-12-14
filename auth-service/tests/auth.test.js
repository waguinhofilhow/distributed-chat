const request = require("supertest");
const app = require("../index");

describe("Testes de Autenticação", () => {

  test("Login com credenciais válidas deve retornar token", async () => {
    const res = await request(app)
      .post("/auth/login")   // ⚠️ AQUI
      .send({
        username: "alice",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("Login com senha incorreta deve falhar", async () => {
    const res = await request(app)
      .post("/auth/login")   // ⚠️ AQUI
      .send({
        username: "alice",
        password: "errada"
      });

    expect(res.statusCode).toBe(401);
  });

  test("Login com usuário inexistente deve falhar", async () => {
    const res = await request(app)
      .post("/auth/login")   // ⚠️ AQUI
      .send({
        username: "usuario_que_nao_existe",
        password: "123456"
      });

    expect(res.statusCode).toBe(401);
  });

});
