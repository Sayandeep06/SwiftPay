import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();
const User = require('../db')
const zod = require('zod')
const jwt = require("jsonwebtoken");
const {JWT} = require("../config")
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
        if(!success){
            return res.status(411).json({
                message: "Incorrect inputs"
            })
        }
        const exits = await User.findOne({
            username: req.body.username
        });
        if(exits){
            return res.json({
                message: "User already exits"
            })
        }
        const user = await User.create({
            username: req.body.username, 
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        })
        const userId = user._id;
        const token = jwt.sign({
            userId
        }, JWT)
        res.json({
            message: "User created",
            token: token
        })
    }catch(e){
        res.json({e})
    }

})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post('/signin', async (req: Request, res: Response): Promise<any> =>{

    try{    
        const {success} = signinBody.safeParse(req.body);
        if(!success){
            return res.status(411).json({
                message: "Incorrect inputs"
            }) 
        }
        const user = await User.findone({
            username: req.body.username, 
            password: req.body.password
        });
        if(user){
            const token = jwt.sign({
                userId: user._id
            }, JWT)
            res.json({
                token: token
            })
        }
    }catch(e){
        res.json({
            e
        })
    }
}) 

const updateBody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
})

router.put('/', authMiddleware, async (req, res): Promise<any> =>{
    const {success} = updateBody.safeparse(req.body)
    if(!success){
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
            firstName: {
                "$regex": param
            }
        }, {
            lastName: {
                "$regex": param
            }
        }]
    })
    res.json({
        //@ts-ignore
        user: users.map(user=>({
            username: user.username,
            firstName: user.firstname,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;