module.exports = {
  apps : [{
    script: "app.js",
    watch: ["server", "client"],
    // Delay between restart
    watch_delay: 1000,
    ignore_watch : ["node_modules"],
    watch_options: {
      "followSymlinks": false
    }
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
