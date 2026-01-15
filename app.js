// Launcher: require the Express server in `./server/index.js` which renders views/index.ejs
try {
  require('./server/index.js');
} catch (err) {
  console.error('Failed to start server from ./server/index.js:');
  console.error(err && err.message ? err.message : err);
  console.error('\nTo run the app:');
  console.error('  cd server');
  console.error('  npm install');
  console.error('  npm start');
  process.exit(1);
}
