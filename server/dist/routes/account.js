"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db_1 = require("../db");
const JWT = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const { authMiddleware } = require('../middleware');
const zod = require('zod');
router.get('/balance', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield db_1.Account.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if (!account)
            return;
        res.json({
            balance: account === null || account === void 0 ? void 0 : account.balance,
        });
    }
    catch (e) {
        res.json({
            //@ts-ignore
            error: e.message
        });
    }
}));
router.post('/transfer', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield mongoose.startSession();
        session.startTransaction();
        const account = yield db_1.Account.findOne({
            //@ts-ignore
            userId: req.userId
        });
        const amount = req.body.amount;
        const to = req.body.to;
        //@ts-ignore
        if (!account || account.balance < amount) {
            yield session.abortTransaction();
            return res.json({
                message: "Insufficient balance"
            });
        }
        const toAcc = yield db_1.Account.findOne({
            userId: to
        });
        if (!toAcc) {
            yield session.abortTransaction();
            return res.json({
                message: "No such account"
            });
        }
        //@ts-ignore
        yield db_1.Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        //@ts-ignore
        yield db_1.Account.updateOne({ userId: toAcc.userId }, { $inc: { balance: amount } }).session(session);
        yield session.commitTransaction();
        res.status(200).json({
            message: "Transfer done"
        });
    }
    catch (err) {
        res.json({
            err
        });
    }
}));
exports.default = router;
