/**
 * Middleware to check if admin is logged in via session or cookie (Vercel Serverless Uyumlu)
 */
const requireAuth = (req, res, next) => {
  const cookieHeader = req.headers.cookie || '';
  const hasAdminCookie = cookieHeader.includes('admin_session=true');
  const hasAdminSession = req.session && req.session.isAdmin;

  if (hasAdminCookie || hasAdminSession) {
    return next();
  }
  
  res.redirect('/admin/login');
};

module.exports = {
  requireAuth
};
