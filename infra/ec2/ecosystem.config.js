module.exports = {
  apps: [
    {
      name: 'sprint-mission',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
