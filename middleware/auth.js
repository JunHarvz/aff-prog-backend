import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    
    const authHeader = req.headers["authorization"];
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1]: authHeader;

    if (!token) return res.status(401).json({ message: "No token, auth denied" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
}

export const isAdmin = (req, res, next) => {
    if(req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admin only" });
    }
    next();
}