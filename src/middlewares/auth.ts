import { expressjwt } from 'express-jwt'; // express-jwt 라이브러리 임포트 (JWT 검증 미들웨어 생성용)
import productRepository from './../product/productRepository'; // 상품 데이터 접근을 위한 레포지토리 임포트
import articleRepository from '../article/articleRepository'; // 게시글 데이터 접근을 위한 레포지토리 임포트
import { CustomError } from '../libs/Handler/errorHandler'; // 커스텀 에러 핸들러 임포트
import { ExpressHandler, ExpressRequest, ExpressResponse, ExpressNextFunction } from '../libs/constants'; // 공통 타입 정의 임포트
import jwt, { JwtPayload } from 'jsonwebtoken'; // jsonwebtoken 라이브러리 및 타입 임포트

const JWT_SECRET = process.env.JWT_SECRET; // 환경 변수에서 JWT 비밀키를 가져옴
if (!JWT_SECRET) { // 비밀키가 설정되지 않은 경우 에러 발생
    throw new Error('JWT_SECRET is not defined in environment variables.'); // 서버 실행 중단 및 에러 메시지 출력
} // 비밀키 확인 종료

const verifyAccessToken: ExpressHandler = expressjwt({ // 액세스 토큰 검증 미들웨어 설정
    secret: JWT_SECRET, // 검증에 사용할 비밀키 설정
    algorithms: ["HS256"], // 사용할 암호화 알고리즘 지정
    requestProperty: 'user' // 검증된 페이로드를 req.user 객체에 저장하도록 설정
}); // 액세스 토큰 검증 설정 종료

const softVerifyAccessToken: ExpressHandler = (req, res, next) => { // 토큰이 없어도 통과시키되, 있으면 정보를 추출하는 미들웨어
    const token = req.headers.authorization?.split(' ')[1]; // Authorization 헤더에서 'Bearer '를 제외한 토큰 문자열 추출
    if (token) { // 토큰이 존재하는 경우
        jwt.verify(token, JWT_SECRET, (err, decoded) => { // 토큰 검증 시도
            if (!err && decoded && typeof decoded === 'object') { // 에러가 없고 유효한 객체 형태의 페이로드인 경우
                req.user = decoded as (JwtPayload & { userId: number; }); // req.user에 사용자 정보 할당
            } // 유효성 확인 종료
            next(); // 다음 미들웨어로 진행 (검증 실패해도 진행)
        }); // 검증 함수 종료
    } else { // 토큰이 없는 경우
        next(); // 바로 다음 미들웨어로 진행
    } // 토큰 존재 여부 확인 종료
}; // softVerifyAccessToken 종료

const verifyRefreshToken: ExpressHandler = expressjwt({ // 리프레시 토큰 검증 미들웨어 설정
    secret: JWT_SECRET, // 검증용 비밀키
    algorithms: ['HS256'], // 알고리즘
    getToken: (req) => req.cookies.refreshToken, // 쿠키에서 리프레시 토큰을 가져오도록 설정
}); // 리프레시 토큰 검증 설정 종료

async function verifyProductAuth // 상품 수정/삭제 권한 확인 함수
    (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) { // 익스프레스 핸들러 인자
    const id = req.params.id || ""; // URL 파라미터에서 상품 ID 추출
    if (!id) throw new CustomError(404, "id가 비 정상적인 값 입니다"); // ID가 없으면 404 에러 발생
    const idtoNumber = parseInt(id); // 문자열 ID를 숫자로 변환
    const product = await productRepository.findById(idtoNumber); // DB에서 해당 상품 조회
    if (!product) { // 상품이 존재하지 않는 경우
        throw new CustomError(404, 'product not found'); // 404 에러 발생
    } // 상품 존재 확인 종료
    // 사용자 정보가 없거나, 상품의 소유자 ID가 요청자 ID와 다르면 권한 없음 처리
    if (typeof req.user !== 'object' || req.user.userId === undefined || product.userId !== req.user.userId) {
        throw new CustomError(403, 'Forbidden'); // 403 금지 에러 발생
    } // 권한 확인 종료
    return next(); // 권한이 확인되면 다음 미들웨어로 진행
}; // verifyProductAuth 종료

async function verifyArticleAuth(req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) { // 게시글 수정/삭제 권한 확인 함수
    const id = req.params.id; // URL 파라미터에서 게시글 ID 추출
    if (!id) throw new CustomError(404, "id가 비 정상적인 값 입니다"); // ID가 없으면 404 에러 발생
    const idtoNumber = parseInt(id); // 문자열 ID를 숫자로 변환
    const article = await articleRepository.findById(idtoNumber); // DB에서 해당 게시글 조회
    if (!article) { // 게시글이 존재하지 않는 경우
        throw new CustomError(404, 'article not found'); // 404 에러 발생
    } // 게시글 존재 확인 종료
    // 사용자 정보가 없거나, 게시글의 소유자 ID가 요청자 ID와 다르면 권한 없음 처리
    if (typeof req.user !== 'object' || req.user.userId === undefined || article.userId !== req.user.userId) {
        throw new CustomError(403, 'Forbidden'); // 403 금지 에러 발생
    } // 권한 확인 종료
    return next(); // 권한이 확인되면 다음 미들웨어로 진행
} // verifyArticleAuth 종료

export default {
    verifyAccessToken,
    softVerifyAccessToken,
    verifyProductAuth,
    verifyArticleAuth,
    verifyRefreshToken,
};