import dotenv from "dotenv";
dotenv.config();

const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
import {Request, Response} from 'express'
import { Account } from '../db';
const JWT = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const {authMiddleware} = require('../middleware')
const zod = require('zod');

router.get('/balance',authMiddleware, async (req: Request, res: Response)=>{
    try{
        const account = await Account.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if(!account)    return;
        res.json({
            balance: account?.balance,
        })
    }catch(e){
        res.json({
            //@ts-ignore
            error: e.message
        })
    }
})

router.post('/transfer', authMiddleware, async (req: Request, res: Response)=>{
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        const account = await Account.findOne({
            //@ts-ignore
            userId: req.userId
        })
        const amount = req.body.amount;
        const to = req.body.to;
        //@ts-ignore
        if(!account || account.balance < amount){
            await session.abortTransaction();
            return res.json({
                message: "Insufficient balance"
            })
        }

        const toAcc = await Account.findOne({
            userId: to
        })
        if(!toAcc) {
            await session.abortTransaction();
            return res.json({
                message: "No such account"
            })
        }
        //@ts-ignore
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        //@ts-ignore
        await Account.updateOne({userId: toAcc.userId},{$inc: {balance: amount}}).session(session);
        await session.commitTransaction();
        res.status(200).json({
            message: "Transfer done"
        })
    }catch(err){
        res.json({
            err
        })
    }
})

export default router;
