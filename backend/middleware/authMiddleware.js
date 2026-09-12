export function requireAuth(req, res, next) {
  const user = req.session?.user;
  const userId = user?.id || req.session?.userId;

  if (userId) {
    if (!req.session.userId) req.session.userId = userId;
    if (!req.session.user) req.session.user = { id: userId };
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Access denied: Authentication required for this terminal directive.',
  });
}
