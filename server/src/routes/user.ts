import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

const {User}= require('../db')
const {Account} = require('../db')
const zod = require('zod')
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const {authMiddleware} = require("../middleware")

const signupBody = zod.object({
    username: zod.string().email(),
    firstname: zod.string(), 
    lastname: zod.string(),
    password: zod.string()
})

router.post('/signup', async (req: Request, res: Response): Promise<any> =>{
     try{    
        const success = signupBody.safeParse(req.body)
        if (!success.success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            })
        }
        const exits = await User.findOne({
            username: req.body.username
        });
        if(exits){
            return res.json({
                message: "User already exists"
            })
        }
        const user = await User.create({
            username: req.body.username, 
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        })
        const userId = user._id;
        await Account.create({
            userId,
            balance: Math.random()*10000 +1
        })
        const token = jwt.sign({
            userId
        }, JWT_SECRET)
        res.status(201).json({
            message: "User created",
            token: token
        })
    }catch(e){
        res.json({
            //@ts-ignore
            error: e.message
        })
    }

})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post('/signin', async (req: Request, res: Response): Promise<any> =>{

    try{    
        const success = signinBody.safeParse(req.body);
        if(!success.success){
            return res.status(411).json({
                message: "Incorrect inputs"
            }) 
        }
        const user = await User.findOne({
            username: req.body.username, 
            password: req.body.password
        });
        if(!user)   return res.status(401).json({ message: "Invalid inputs"});
        if(user){
            const token = jwt.sign({
                userId: user._id
            }, JWT_SECRET)
            res.status(200).json({
                token: token
            })
        }
    }catch(e){
        res.json({
            //@ts-ignore
            error: e.message
        })
    }
}) 

const updateBody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
})

router.put('/', authMiddleware, async (req, res): Promise<any> =>{
    const success = updateBody.safeParse(req.body)
    if(!success.success){
        return res.json({
            message: "Error while updating info"
        })
    }
    await User.updateOne({
        //@ts-ignore
        _id: req.userId,
    },req.body);

    res.json({
        message: "updated"
    })
})

router.get('/bulk', async (req, res) =>{
    const param = await req.query.filter || "";
    
    const users = await User.find({
        $or: [{
            firstname: {
                "$regex": param
            }
        }, {
            lastname: {
                "$regex": param
            }
        }]
    })
    res.json({
        //@ts-ignore
        user: users.map(user=>({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    })
})

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            //@ts-ignore
            users: users.map(user => ({
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                _id: user._id  
            }))
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

export default router;