const app = require('./api/index');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  ☕ Qfi Coffee & Bakery Web Application
  ---------------------------------------
  🚀 Server listening on: http://localhost:${PORT}
  📱 QR Menu: http://localhost:${PORT}/menu
  🔐 Admin Dashboard: http://localhost:${PORT}/admin/login
  ---------------------------------------
  `);
});
