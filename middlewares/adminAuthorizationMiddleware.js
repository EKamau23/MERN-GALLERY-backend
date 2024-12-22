// middlewares/adminAuthorizationMiddleware.js

const adminOnly = (req, res, next) => {
  const { role } = req.user; // Assuming user role is attached to the request object (e.g., via JWT)

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden: Admins only.' });
  }

  next();
};

module.exports = { adminOnly };
