const path = require('path');

module.exports = {
  apps: [{
    name: 'sprint-app',
    // 'npm' 대신 실제 실행 파일 경로를 지정하는 것이 더 안정적입니다.
    script: path.join(__dirname, '../../../src/app.js'), 
    cwd: path.join(__dirname, '../../../'),
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production',
    }
  }]
};