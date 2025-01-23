function authMiddleware(req, res, next) {
    if (req.session.userId) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }

export default authMiddleware;