import request from 'supertest';
import app from './../src/main';

describe('Auth API Integration Tests', () => {
    const newUser = {
        email: `test${Date.now()}@example.com`,
        nickname: `testuser_${Date.now()}`,
        password: 'password123'
    };

    describe('POST /auth/signup', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .send(newUser);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('email', newUser.email);
        });

        it('should fail if email already exists', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .send(newUser);

            expect(res.status).not.toBe(201);
        });
    });

    describe('POST /auth/login', () => {
        it('should login and return tokens', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: newUser.email,
                    password: newUser.password
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
        });
    });
});