// Small shim to allow running `node server.js` while the app source uses ESM `import` syntax
// This file uses a dynamic import so it can be executed by Node in CommonJS mode
(async () => {
  try {
    await import('./index.js');
  } catch (err) {
    console.error('Failed to start application:', err);
    process.exit(1);
  }
})();
