const supertest = require("supertest");
const app = require("../app");
const truncate = require("../utils/truncate");

// reset database user
truncate.user();

const user = {
  name: "sabrina",
  email: "sabrina3@mail.com",
  password: "password123",
  token: "",
};

// register
describe("TEST /auth/register endpoint", () => {
  // positive
  test("Register berhasil : email belum terdaftar", () => {
    return supertest(app)
      .post("/auth/register")
      .send(user)
      .then((res) => {
        console.log(res.body);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("status");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data).toHaveProperty("name");
        expect(res.body.data).toHaveProperty("email");
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe("user created!");
      });
  });

  // negative
  test("Register gagal : email sudah terdaftar", () => {
    return supertest(app)
      .post("/auth/register")
      .send(user)
      .then((res) => {
        console.log(res.body);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("status");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("data");
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe("email already used!");
      });
  });
});

// login
describe("TEST /auth/login endpoint", () => {
  test("Login berhasil : email dan password valid", () => {
    return supertest(app)
      .post("/auth/login")
      .send(user)
      .then((res) => {
        console.log(res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("token");
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe("login success!");

        user.token = res.body.data.token;
      });
  });

  test("Login gagal : email dan password tidak valid", () => {
    return supertest(app)
      .post("/auth/login")
      .send({
        email: user.email,
        password: `${user.password}45`,
      })
      .then((res) => {
        console.log(res.body);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("status");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("data");
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe("credential is not valid!");
      });
  });
});

// whoami
describe("TEST /auth/whoami endpoint", () => {
  test("Fetch user berhasil : token di provide", () => {
    return supertest(app)
      .get("/auth/whoami")
      .set("Authorization", user.token)
      .then((res) => {
        console.log(res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data).toHaveProperty("name");
        expect(res.body.data).toHaveProperty("email");
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe("fetch user success!");
      });
  });

  test("Fetch user gagal : token tidak di provide", () => {
    return supertest(app)
      .get("/auth/whoami")
      .then((res) => {
        console.log(res.body);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("status");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("data");
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe("you're not authorized!");
      });
  });
});
