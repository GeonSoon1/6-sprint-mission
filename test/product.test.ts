import request from 'supertest';
import app from './../src/main';

describe('Product API Integration Tests', () => {
    let accessToken: string;
    let createdProductId: number;

    // 테스트 전 토큰 발급
    beforeAll(async () => {
        const user = {
            email: `product_tester_${Date.now()}@test.com`,
            nickname: 'tester',
            password: 'password123'
        };
        await request(app).post('/auth/signup').send(user);
        const res = await request(app).post('/auth/login').send({ email: user.email, password: user.password });
        accessToken = res.body.accessToken;
    });

    describe('Public Routes', () => {
        it('GET /products - should return list of products', async () => {
            const res = await request(app).get('/products');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.list)).toBe(true);
        });
    });

    describe('Protected Routes', () => {
        const newProduct = {
            name: 'Test Product',
            description: 'Test Description',
            price: 10000,
            tags: ['test', 'jest']
        };

        it('POST /products - should create a product (Authorized)', async () => {
            const res = await request(app)
                .post('/products')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(newProduct);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            createdProductId = res.body.id;
        });

        it('POST /products - should fail without token', async () => {
            const res = await request(app)
                .post('/products')
                .send(newProduct);

            expect(res.status).toBe(401);
        });

        it('GET /products/:id - should return product detail', async () => {
            const res = await request(app).get(`/products/${createdProductId}`);
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(createdProductId);
        });

        it('PATCH /products/:id - should update product', async () => {
            const res = await request(app)
                .patch(`/products/${createdProductId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ price: 20000 });

            expect(res.status).toBe(200);
            expect(res.body.price).toBe(20000);
        });

        it('DELETE /products/:id - should delete product', async () => {
            const res = await request(app)
                .delete(`/products/${createdProductId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200); // 또는 204
        });
    });
});