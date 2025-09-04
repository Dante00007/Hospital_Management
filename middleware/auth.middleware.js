import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const validateToken = (req, res,next) => { 
     try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
       
        req.user = decoded;
        next();

    } catch (err) {
        return res.status(403).json({ error: err });
    }
};