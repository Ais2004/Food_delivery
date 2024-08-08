import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader); // Debugging log
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        console.log("No token provided"); // Debugging log
        return res.status(401).json({ success: false, message: "No token provided" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token to req.user
        console.log("Token verified:", decoded); // Debugging log
        next();
    } catch (error) {
        console.log("Unauthorized:", error.message); // Debugging log
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

export default authMiddleware;
