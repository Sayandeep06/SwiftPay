import dotenv from "dotenv";
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken")
import { Request, Response, NextFunction } from "express"

const authMiddleware = (req: Request, res: Response, next: NextFunction ) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(403).json({});
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, JWT_SECRET)
        //@ts-ignore
        req.userId = decoded.userId;
        next();
    }catch(e){
        return res.status(403).json({});
    }
    
};

module.exports = {
    authMiddleware
}