'build/main.js',module.exports = {
  apps: [
    {
      name: 'sprint-mission',
      script: 'build/main.js', 
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
