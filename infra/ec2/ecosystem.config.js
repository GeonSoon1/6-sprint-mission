module.exports = {
  apps: [
    {
      name: 'panda-market-api', // 앱 이름
      script: './dist/main.js', // 실행할 파일 경로
      instances: 1, // CPU 코어 수만큼 실행하려면 'max'
      exec_mode: 'cluster', // 병렬 실행 모드 (cluster 추천)
      env: {
        // 기본 환경 변수
        NODE_ENV: 'development',
      },
      env_production: {
        // 프로덕션 환경 변수 (pm2 start --env production)
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
