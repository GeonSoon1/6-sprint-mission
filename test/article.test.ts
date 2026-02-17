import request from 'supertest';
import app from './../src/main';

describe('Article API Integration Tests', () => {
    let accessToken: string;
    let createdArticleId: number;

    beforeAll(async () => {
        const user = {
            email: `article_tester_${Date.now()}@test.com`,
            nickname: `writer_${Date.now()}`,
            password: 'password123'
        };
        await request(app).post('/auth/signup').send(user);
        const res = await request(app).post('/auth/login').send({ email: user.email, password: user.password });
        accessToken = res.body.accessToken;
    });

    describe('Public Routes', () => {
        it('GET /articles - should return list of articles', async () => {
            const res = await request(app)
                .get('/articles')
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.status).toBe(200);
            // 응답이 배열 자체이거나, list 속성에 배열이 있는 경우 모두 허용
            const articles = Array.isArray(res.body) ? res.body : res.body.list;
            expect(Array.isArray(articles)).toBe(true);
        });
    });

    describe('Protected Routes', () => {
        const newArticle = {
            title: 'Test Article',
            content: 'This is a test content.'
        };

        it('POST /articles - should create an article', async () => {
            const res = await request(app)
                .post('/articles')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(newArticle);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            createdArticleId = res.body.id;
        });

        it('GET /articles/:id - should return article detail', async () => {
            const res = await request(app)
                .get(`/articles/${createdArticleId}`)
                .set('Authorization', `Bearer ${accessToken}`);
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(createdArticleId);
        });

        it('PATCH /articles/:id - should update article', async () => {
            const res = await request(app)
                .patch(`/articles/${createdArticleId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Updated Title' });

            expect(res.status).toBe(200);
            expect(res.body.title).toBe('Updated Title');
        });

        it('DELETE /articles/:id - should delete article', async () => {
            const res = await request(app)
                .delete(`/articles/${createdArticleId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
        });
    });
});