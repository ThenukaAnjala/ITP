// middleware/roles.js
export const authorizeRoles = (...allowed) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  }
  next();
};
