export function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }

  // Development / Demo fallback if session is active
  if (req.session && req.session.user) {
    req.session.userId = req.session.user.id;
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Access denied: Authentication required for this terminal directive.',
  });
}
