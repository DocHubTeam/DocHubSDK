const { exec } = require('child_process');

module.exports = {
    exec(command, options) {
        return new Promise((resolve, reject) => {
            exec(command, options, (error, stdout, stderr) => {
              if (error) {
                reject(error, stderr);
                return;
              }
              resolve(stdout);
            });
          });
    }
};
