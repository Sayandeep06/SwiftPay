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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { User } = require('../db');
const { Account } = require('../db');
const zod = require('zod');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { authMiddleware } = require("../middleware");
const signupBody = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string()
});
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const success = signupBody.safeParse(req.body);
        if (!success.success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            });
        }
        const exits = yield User.findOne({
            username: req.body.username
        });
        if (exits) {
            return res.json({
                message: "User already exists"
            });
        }
        const user = yield User.create({
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        const userId = user._id;
        yield Account.create({
            userId,
            balance: Math.random() * 10000 + 1
        });
        const token = jwt.sign({
            userId
        }, JWT_SECRET);
        res.status(201).json({
            message: "User created",
            token: token
        });
    }
    catch (e) {
        res.json({
            //@ts-ignore
            error: e.message
        });
    }
}));
const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const success = signinBody.safeParse(req.body);
        if (!success.success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            });
        }
        const user = yield User.findOne({
            username: req.body.username,
            password: req.body.password
        });
        if (!user)
            return res.status(401).json({ message: "Invalid inputs" });
        if (user) {
            const token = jwt.sign({
                userId: user._id
            }, JWT_SECRET);
            res.status(200).json({
                token: token
            });
        }
    }
    catch (e) {
        res.json({
            //@ts-ignore
            error: e.message
        });
    }
}));
const updateBody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
});
router.put('/', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const success = updateBody.safeParse(req.body);
    if (!success.success) {
        return res.json({
            message: "Error while updating info"
        });
    }
    yield User.updateOne({
        //@ts-ignore
        _id: req.userId,
    }, req.body);
    res.json({
        message: "updated"
    });
}));
router.get('/bulk', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const param = (yield req.query.filter) || "";
    const users = yield User.find({
        $or: [{
                firstname: {
                    "$regex": param
                }
            }, {
                lastname: {
                    "$regex": param
                }
            }]
    });
    res.json({
        //@ts-ignore
        user: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    });
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find();
        res.json({
            //@ts-ignore
            users: users.map(user => ({
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                _id: user._id
            }))
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}));
exports.default = router;
