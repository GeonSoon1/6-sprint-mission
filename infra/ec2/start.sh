cd /home/ec2-user/6-sprint-mission

pm2 start /home/ec2-user/6-sprint-mission/infra/ec2/ecosystem.config.js --env production

pm2 status
