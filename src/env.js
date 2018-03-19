const fs = require('fs');
const env = JSON.parse(fs.readFileSync( __dirname + '/../env.json', 'utf8'));

module.exports = env