// src/main.js
import util from "node:util";
import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
  createTravelArticle,
} from "./.articleService.js";
import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
  createBespokeAIJet,
} from "./.productService.js";
import { Product } from "./.product.js";
import { ElectronicProduct } from "./.electroniceProduct.js";
import { Article } from "./.article.js";

/* ===========================
   실행 데모
   =========================== */
(async () => {
  // ------- Article API (.then/.catch) -------
  getArticleList(1, 5, "")
    .then((list) => console.log("Article List(meta):", list?.meta))
    .catch(() => {});

  getArticle(1)
    .then((art) =>
      console.log("Article #1:", { id: art?.id, title: art?.title })
    )
    .catch(() => {});

  // 여행 글 생성
  createTravelArticle()
    .then((travelArticle) => {
      console.log("Created Travel Article:", {
        id: travelArticle?.id,
        title: travelArticle?.title,
        content: travelArticle?.content,
        image: travelArticle?.image,
      });
    })
    .catch(() => {});

  createArticle({
    title: "도시 여행기",
    content: "내용입니다.",
    image: "https://picsum.photos/600/400",
  })
    .then((created) => {
      console.log("Created Article:", {
        id: created?.id,
        title: created?.title,
      });

      // Article instance 생성 및 출력
      const articleInstance = new Article(
        created.title,
        "도시 여행 내용입니다.",
        "작성자"
      );
      articleInstance.like();
      articleInstance.favorite();
      console.log("Created Article instance:", {
        title: articleInstance.title,
        likeCount: articleInstance.likeCount,
        favoriteCount: articleInstance.favoriteCount,
        createdAt: articleInstance.createdAt.toISOString(),
      });

      return patchArticle(created.id, { title: "수정된 제목" });
    })
    .then((patched) => {
      console.log("Patched Article:", {
        id: patched?.id,
        title: patched?.title,
      });

      // 수정된 Article instance 생성 및 출력
      const patchedArticleInstance = new Article(
        patched.title,
        "수정된 내용",
        "작성자"
      );
      patchedArticleInstance.like();
      patchedArticleInstance.like();
      patchedArticleInstance.favorite();
      patchedArticleInstance.favorite();
      patchedArticleInstance.favorite();
      console.log("Patched Article instance:", {
        title: patchedArticleInstance.title,
        likeCount: patchedArticleInstance.likeCount,
        favoriteCount: patchedArticleInstance.favoriteCount,
        createdAt: patchedArticleInstance.createdAt.toISOString(),
      });

      return deleteArticle(patched.id);
    })
    .then((deleted) => {
      console.log("Deleted Article:", deleted?.id);

      // 삭제된 Article instance 생성 및 출력
      const deletedArticleInstance = new Article(
        "도심 속으로",
        "삭제된 내용",
        "작성자"
      );
      console.log("Deleted Article instance:", {
        title: deletedArticleInstance.title,
        likeCount: deletedArticleInstance.likeCount,
        favoriteCount: deletedArticleInstance.favoriteCount,
        createdAt: deletedArticleInstance.createdAt.toISOString(),
      });
    })
    .catch(() => {});

  // ------- Product API (async/await) -------
  try {
    console.log("[Product API] 상품 목록 조회 시작...");
    const listRes = await getProductList(1, 10, "");
    const items = listRes?.list ?? [];
    console.log(`[Product API] ${items.length}개의 상품을 조회했습니다.`);

    // 요구사항: 리스트를 인스턴스로 변환해 products 배열에 저장
    // 해시태그에 "전자제품"이 포함되어 있는 상품들은 ElectronicProduct 클래스 사용
    // 나머지 상품들은 모두 Product 클래스 사용
    const products = items
      .map((productData, index) => {
        try {
          // 상품 데이터 유효성 검사
          if (!productData || typeof productData !== "object") {
            console.warn(
              `[Product API] 상품 ${index}번째 데이터가 유효하지 않습니다.`
            );
            return null;
          }

          const {
            name,
            description,
            price,
            tags = [],
            images = [],
            manufacturer,
          } = productData;

          // 필수 필드 검사
          if (!name || !description || typeof price !== "number") {
            console.warn(
              `[Product API] 상품 "${name}"의 필수 필드가 누락되었습니다.`
            );
            return null;
          }

          // 해시태그에 "전자제품"이 포함되어 있는지 정확히 확인
          const isElectronic =
            Array.isArray(tags) &&
            tags.some(
              (tag) => typeof tag === "string" && tag.trim() === "전자제품"
            );

          if (isElectronic) {
            console.log(
              `[Product API] "${name}"을 ElectronicProduct로 생성합니다.`
            );
            return new ElectronicProduct(
              name,
              description,
              price,
              tags,
              images,
              manufacturer || "Unknown"
            );
          } else {
            console.log(`[Product API] "${name}"을 Product로 생성합니다.`);
            return new Product(name, description, price, tags, images);
          }
        } catch (error) {
          console.error(
            `[Product API] 상품 ${index}번째 인스턴스 생성 실패:`,
            error.message
          );
          return null;
        }
      })
      .filter((product) => product !== null); // null 값 제거

    console.log(
      `[Product API] 총 ${products.length}개의 상품 인스턴스가 생성되었습니다.`
    );

    // 콘솔 예쁘게 (배열 내부는 [Array]로 축약)
    const pretty = util.inspect(
      products.map((pr) => ({
        name: pr.name,
        price: pr.price,
        tags: pr.tags,
        images: pr.images,
        summary: pr.summary(),
      })),
      { depth: 1, colors: true, maxArrayLength: 0 }
    );

    console.log("products:", pretty);

    // 단건 조회/생성/수정/삭제 샘플
    if (items[0]?.id) {
      console.log("[Product API] 첫 번째 상품 단건 조회...");
      const one = await getProduct(items[0].id);
      console.log("first product raw:", { id: one.id, name: one.name });
    }

    // 테스트 상품 생성
    console.log("[Product API] 테스트 상품 생성...");
    const created = await createProduct({
      name: "테스트 상품",
      description: "API로 생성된 테스트 상품입니다.",
      price: 9900,
      tags: ["테스트"],
      images: ["https://picsum.photos/640/480"],
    });
    console.log("created product:", created?.id);

    // Bespoke AI 제트 400W 제품 생성
    console.log("[Product API] Bespoke AI 제트 400W 제품 생성...");
    const bespokeAI = await createBespokeAIJet();
    console.log("created Bespoke AI Jet:", {
      id: bespokeAI?.id,
      name: bespokeAI?.name,
      price: bespokeAI?.price,
      tags: bespokeAI?.tags,
    });

    // 상품 수정 및 삭제
    if (created?.id) {
      console.log("[Product API] 상품 수정...");
      const patched = await patchProduct(created.id, {
        price: 12345,
        tags: ["테스트", "전자제품"],
      });
      console.log("patched price:", patched?.price);

      console.log("[Product API] 상품 삭제...");
      await deleteProduct(created.id);
      console.log("deleted product:", created.id);
    }
  } catch (e) {
    console.error("[Product API] Product flow error:", e.message);
    console.error("[Product API] Error details:", e);
  }

  // ------- 클래스 동작 확인 -------
  const a = new Article("제목", "내용", "작성자");
  a.like();
  a.like();
  a.favorite();
  console.log("Article instance:", {
    title: a.title,
    likeCount: a.likeCount,
    favoriteCount: a.favoriteCount,
    createdAt: a.createdAt.toISOString(),
  });

  const p = new Product("일반상품", "설명", 1000, ["태그"], ["img"]);
  const e = new ElectronicProduct(
    "전자상품",
    "설명",
    2000,
    ["전자제품"],
    ["img"],
    "ACME"
  );
  p.favorite();
  e.favorite();
  e.favorite();
  console.log(
    "Product favorite:",
    p.getFavoriteCount(),
    "| Electronic favorite:",
    e.getFavoriteCount()
  );
})();
