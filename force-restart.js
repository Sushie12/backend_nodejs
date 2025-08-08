// This file forces Render to restart the server
// Delete this file after deployment

console.log('Force restart file loaded - server should restart now');

module.exports = {
    forceRestart: true,
    timestamp: new Date().toISOString()
}; 