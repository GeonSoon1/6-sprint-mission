module.exports ={
  apps: [{
    name: "yoo-pandamarket",
	  script: "./dist/main.js",
	  instances: 1,
	  exec_mode: "fork",
	  env_production:{
		NODE_ENV: "production",
	  }
  }]
}
