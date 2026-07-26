/**
 * Middleware to check if admin is logged in via session
 */
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.redirect('/admin/login');
};

module.exports = {
  requireAuth
};
