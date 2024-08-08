import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Set the decoded user information
        console.log('Token verified:', decoded); // Log the decoded token for debugging
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

export default authMiddleware;
